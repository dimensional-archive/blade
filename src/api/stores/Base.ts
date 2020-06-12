import { ParseError } from "@ayanaware/errors";
import { join, relative, sep } from "path";

import { LiteEmitter } from "../../utils/LiteEmitter";
import { Util } from "../../utils/Util";
import { Component, ComponentOptions } from "../components/Base";
import { BladeClient } from "../Client";

export type LoadFilter = (file: string) => boolean | Promise<boolean>;
export type ComponentResolvable<T> = string | T;

export interface ComponentStoreOptions {
  classToHandle?: typeof Component;
  priority?: number;
  loadFilter?: LoadFilter;
  autoCategory?: boolean;
  defaults?: ComponentOptions;
  createDirectory?: boolean;
  directory?: string;
}

/**
 * A component store.
 * @since 1.0.0
 */
export abstract class ComponentStore<T extends Component> extends LiteEmitter {
  private static _defaults: ComponentStoreOptions = {
    priority: -1,
    classToHandle: Component,
    autoCategory: false,
    loadFilter: () => true,
    createDirectory: true
  }

  /**
   * The client that is using this store.
   * @since 1.0.0
   */
  public readonly client: BladeClient;
  /**
   * All of the loaded components.
   * @since 1.0.0
   */
  public readonly components: Map<string, T> = new Map();

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
  public classToHandle: typeof Component;
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
  protected constructor(client: BladeClient, name: string, options: ComponentStoreOptions = {}) {
    super();
    options = Object.assign(options, ComponentStore._defaults);

    this.client = client;
    this.name = name;

    this.priority = options.priority ?? -1;
    this.classToHandle = options.classToHandle ?? Component;
    this.loadFilter = options.loadFilter ?? (() => false);
    this.createDirectory = options.createDirectory ?? true;
    this.directory = options.directory ?? join(client.directory, this.name);

    if (options.defaults) options.classToHandle!.defaults = options.defaults;
  }

  public static walkDir(store: ComponentStore<Component>, dir: string): Promise<Component>[] {
    const files = Util.walk(dir);
    return files.map(file => store.load(dir, relative(dir, file).split(sep)));
  }


  public async load(directory: string, file: string[]): Promise<T> {
    const loc = join(directory, ...file);
    let comp;

    try {
      const loaded = await import(loc);
      const loadedComp = 'default' in loaded ? loaded.default : loaded;

      if (!Util.isClass(loadedComp)) throw new ParseError('The exported structure is not a class.');

      this.add(new loadedComp(this, directory, file))
    } catch (e) {
      this.emit("loadError", new ParseError(`Couldn't parse file ${file}`).setCause(e));
    }

    delete require.cache[loc];
    module.children.pop();

    return comp;
  }

  /**
   * Loads all files in the given directory.
   * @since 1.0.0
   * @returns {number} Total components loaded.
   */
  public async loadAll(): Promise<number> {
    this.components.clear();
    await ComponentStore.walkDir(this, this.directory);
    return this.components.size;
  }

  /**
   * Resolves a string or component into... a component.
   * @param resolvable
   * @returns {Component} The resolved component.
   */
  public resolve(resolvable: ComponentResolvable<T>): T | undefined {
    if (typeof resolvable === "string") return this.components.get(resolvable);
    else if (resolvable instanceof this.classToHandle) return resolvable;
    else return;
  }

  /**
   * Removes a component from the store.
   * @param resolvable The component to remove.
   * @since 1.0.0
   */
  public remove(resolvable: ComponentResolvable<T>): T | null {
    const comp = this.resolve(resolvable);

    if (comp) {
      this.emit("compRemoved", comp);
      this.components.delete(comp.name);
      return comp;
    }

    return null;
  }

  /**
   * Adds a component to the store.
   * @param component
   * @since 1.0.0
   */
  public add(component: T): T | null {
    if (!(component instanceof this.classToHandle)) {
      this.emit("loadError", `Only ${this} can be added into this store.`);
      return null;
    }

    this.components.delete(component.name);
    this.components.set(component.name, component);
    this.emit("loaded", component);

    return component;
  }

  /**
   * Returns the string representation of this store.
   * @since 1.0.0
   */
  public toString(): string {
    return this.name;
  }
}
