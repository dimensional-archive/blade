import { ParseError } from "@ayanaware/errors";
import { join, relative, sep } from "path";
import { LiteEmitter } from "../../util/LiteEmitter";
import { Util } from "../../util/Util";
import { Part, PartOptions } from "./Component";
import { Collection } from "../../util/Storage";

import type { BladeClient } from "../../Client";
import { mkdir } from "fs";

export type LoadFilter = (file: string) => boolean | Promise<boolean>;
export type ComponentResolvable<T> = string | T;

export interface StoreOptions {
  classToHandle?: typeof Part;
  priority?: number;
  loadFilter?: LoadFilter;
  autoCategory?: boolean;
  defaults?: PartOptions;
  createDirectory?: boolean;
  directory?: string;
}

/**
 * A part store.
 * @since 1.0.0
 */
export abstract class Store<T extends Part> extends LiteEmitter {
  private static _defaults: StoreOptions = {
    priority: -1,
    classToHandle: Part,
    autoCategory: false,
    loadFilter: () => true,
    createDirectory: true,
  };

  /**
   * The client that is using this store.
   * @since 1.0.0
   */
  public readonly client: BladeClient;
  /**
   * All of the loaded parts.
   * @since 1.0.0
   */
  public readonly parts: Collection<string, T> = new Collection();

  /**
   * The name of this store.
   * @since 1.0.0
   */
  public name: string;
  /**
   * The priority this store has when being loaded.
   * @since 1.0.0
   */
  public priority: number;
  /**
   * The class this store handles / loads.
   * @since 1.0.0
   */
  public classToHandle: typeof Part;
  /**
   * The load filter for this store.
   * @since 1.0.0
   */
  public loadFilter: LoadFilter;
  /**
   * Whether to create the directory if none exists.
   * @since 1.0.0
   */
  public createDirectory: boolean;
  /**
   * The directory to load from.
   * @since 1.0.0
   */
  public directory: string;

  /**
   * Creates a new Component Store.
   * @param client The client that's using this store.
   * @param name The name of this store.
   * @param options The options to give this store.
   * @since 1.0.0
   */
  protected constructor(
    client: BladeClient,
    name: string,
    options: StoreOptions = {}
  ) {
    super();
    options = Object.assign(options, Store._defaults);

    this.client = client;
    this.name = name;
    this.client.stores.set(name, this);

    this.priority = options.priority ?? -1;
    this.classToHandle = options.classToHandle ?? Part;
    this.loadFilter = options.loadFilter ?? (() => false);
    this.createDirectory = options.createDirectory ?? true;
    this.directory = options.directory ?? join(client.directory, this.name);

    if (options.defaults) options.classToHandle!.defaults = options.defaults;
    if (client.started) this.loadAll();
  }

  public static walkDir(
    store: Store<Part>,
    dir: string
  ): Promise<Part>[] {
    let files: string[] = [];
    try {
      files = Util.walk(dir);
    } catch (e) {
      if (store.createDirectory) {
        mkdir(dir, () => {
          files = Util.walk(dir);
        });
      }
    }

    return files.map((file) => store.load(dir, relative(dir, file).split(sep)));
  }

  public async load(directory: string, file: string[]): Promise<T> {
    const loc = join(directory, ...file);
    let comp;

    try {
      const loaded = await import(loc);
      const loadedComp = "default" in loaded ? loaded.default : loaded;

      if (!Util.isClass(loadedComp))
        throw new ParseError("The exported structure is not a class.");

      this.add(new loadedComp(this, directory, file));
    } catch (e) {
      this.emit(
        "loadError",
        new ParseError(`Couldn't parse file ${file}`).setCause(e)
      );
    }

    delete require.cache[loc];
    module.children.pop();

    return comp;
  }

  /**
   * Loads all files in the given directory.
   * @since 1.0.0
   * @returns {number} Total parts loaded.
   */
  public async loadAll(): Promise<number> {
    this.parts.clear();
    await Store.walkDir(this, this.directory);
    return this.parts.size;
  }

  /**
   * Resolves a string or part into... a part.
   * @param resolvable
   * @returns {Part} The resolved part.
   */
  public resolve(resolvable: ComponentResolvable<T>): T | undefined {
    if (typeof resolvable === "string") return this.parts.get(resolvable);
    else if (resolvable instanceof this.classToHandle) return resolvable;
    else return;
  }

  /**
   * Removes a part from the store.
   * @param resolvable The part to remove.
   * @since 1.0.0
   */
  public remove(resolvable: ComponentResolvable<T>): T | null {
    const comp = this.resolve(resolvable);

    if (comp) {
      this.emit("compRemoved", comp);
      this.parts.delete(comp.name);
      return comp;
    }

    return null;
  }

  /**
   * Adds a part to the store.
   * @param part
   * @since 1.0.0
   */
  public add(part: T): T | null {
    if (!(part instanceof this.classToHandle)) {
      this.emit("loadError", `Only ${this} can be added into this store.`);
      return null;
    }

    this.parts.delete(part.name);
    this.parts.set(part.name, part);
    this.emit("loaded", part);

    return part;
  }

  /**
   * Returns the string representation of this store.
   * @since 1.0.0
   */
  public toString(): string {
    return this.name;
  }
}
