import { EventEmitter } from "events";
import { join, relative, sep } from "path";
import { Constructor, Store } from "@kyudiscord/neo";
import { lstatSync, Stats } from "fs";
import { Module, ModuleResolvable } from "./Module";
import { isClass, readDir } from "../../util";

import type { BladeClient } from "../../Client";

export class Handler<T extends Module> extends EventEmitter {
  /**
   * The client instance.
   */
  public readonly client: BladeClient;

  /**
   * The component store.
   */
  public readonly store: Store<string, T>;

  /**
   * The name of this handler.
   */
  public readonly name: string;

  /**
   * The directory this handler loads.
   */
  public directory: string;

  /**
   * The filter to use when loading files..
   */
  public loadFilter: LoadFilter;

  /**
   * The typeof class this handler is supposed to load.
   */
  public class: Constructor<T>;

  /**
   * @param client
   * @param name
   * @param options
   */
  public constructor(client: BladeClient, name: string, options: HandlerOptions) {
    super();

    client.handlers.set(name, this);

    this.client = client;
    this.store = new Store();
    this.name = name;

    this.directory = options.directory ?? join(client.userDirectory, name);
    this.loadFilter = options.loadFilter ?? (() => true);
    this.class = (options.class ?? Module) as Constructor<T>;
  }

  /**
   * Walks a directory.
   * @param dir The directory to walk.
   */
  public static walk(dir: string): Tuple<string, string[]>[] {
    return readDir(dir).map(f => [ dir, relative(dir, f).split(sep) ]);
  }

  /**
   * Find a module from an export.
   * @param module The module.
   * @since 1.0.0
   */
  private static findModule(module: NodeJS.Dict<unknown>): Constructor<unknown> | null {
    if (module.__esModule) {
      if (isClass(module.default))
        return module.default;

      const keys = Object.keys(module);
      let _class: Constructor<unknown> | null = null;

      for (const key of keys) {
        const obj = module[key];
        if (isClass(obj)) {
          _class = obj;
          break;
        }
      }

      return _class;
    }

    if (!isClass(module))
      throw new Error("Exported value is not a class.");

    return module;
  }

  /**
   * Loads a file.
   * @since 1.0.0
   */
  public async load(dir: string, file: string[], reload = false): Promise<T | null> {
    const path = join(dir, ...file);
    let mod: T | null = null;

    try {
      const Loaded = Handler.findModule(await import(path));

      if (!Loaded) return null;
      if (!isClass(Module)) throw new Error(`File: "${path}" does not export a class.`);

      mod = new Loaded(this.client) as T;
      mod["_patch"](this, dir, file);
      this.add(mod, reload);
    } catch (e) {
      this.emit("loadError", e, path);
    }

    delete require.cache[path];
    module.children.pop();

    return mod;
  }

  /**
   * Loads all files in a directory.
   * @param directory The directory to load from.
   * @since 1.0.0
   */
  public async loadAll(directory: string = this.directory): Promise<number> {
    const files = Handler.walk(this.dir(directory))
      .filter(f => {
        const full = join(f[0], ...f[1]);
        return this.loadFilter(full, lstatSync(full));
      });

    await Promise.all(files.map(f => this.load(f[0], f[1])));
    return this.store.size;
  }

  /**
   * Resolves a string or module into a module.
   * @param resolvable
   * @since 1.0.0
   */
  public get(resolvable: ModuleResolvable<T>): T | undefined {
    if (typeof resolvable === "string") return this.store.get(resolvable);
    else if (resolvable instanceof this.class) return resolvable;
    return;
  }

  /**
   * Adds a new module to this handler.
   * @param module The module to add.
   * @param reload Whether or not the module was reloaded.
   * @since 1.0.0
   */
  public add(module: T, reload = false): T | null {
    if (!(module instanceof this.class)) {
      this.emit("loadError", new TypeError(`Only ${this} can be handled`), module);
      return null;
    }

    this.store.delete(module.id);
    this.store.set(module.id, module);
    if (!reload) this.emit("moduleLoaded", module);

    return module;
  }

  public remove(resolvable: ModuleResolvable<T>, emit = true): T | null {
    const module = this.get(resolvable);
    if (module) {
      if (emit) this.emit("moduleRemoved");
      this.store.delete(module.id);
      return module;
    }

    return null;
  }

  /**
   * Emits an event to all handlers.
   * @param event The event to emit.
   * @param args The arguments to pass.
   * @since 1.0.0
   */
  public emit(event: string, ...args: unknown[]): boolean {
    return this.listenerCount(event)
      ? super.emit(event, ...args)
      : false;
  }

  /**
   * Get the directory of this handler.
   */
  private dir(path: string): string {
    const dir = path.split(sep);
    return dir[dir.length - 1] === this.name
      ? path
      : join(path, this.name);
  }
}

export type LoadFilter = (path: string, stats: Stats) => boolean;

export interface HandlerOptions {
  directory?: string;
  loadFilter?: LoadFilter
  class?: Constructor<Module>;
}


