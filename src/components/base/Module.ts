import { Structure } from "@kyudiscord/neo";
import { Logger } from "@melike2d/logger";
import { join } from "path";

import type { BladeClient } from "../../Client";
import type { Handler } from "./Handler";

export class Module<O extends ModuleOptions = ModuleOptions> extends Structure {
  /**
   * The options that were provided.
   */
  public readonly options: O;

  /**
   * The ID of this component.
   */
  public id: string;

  /**
   * The logger for this component.
   */
  public logger!: Logger;

  /**
   * The handler that loaded this component.
   */
  public handler!: Handler<Module>;

  /**
   * Whether or not this component is enabled.
   */
  public enabled: boolean;

  /**
   * The category of this command.
   */
  public categoryId!: string;

  /**
   * This components path.
   */
  public path!: string;

  /**
   * The location of this file.
   */
  protected _loc!: Tuple<string, string[]>;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: Partial<O> = {}) {
    super(client);

    this.options = options as O;

    this.id = options.id!;
    this.enabled = options.enabled ?? true;
    this.categoryId = options.category!;
  }

  /**
   * Ran when the client is ready.
   * @since 1.0.0
   */
  public init(): unknown {
    return;
  }

  /**
   * Disables this component.
   * @since 1.0.0
   */
  public disable(): this {
    this.enabled = false;
    this.handler.emit("moduleDisabled", this);
    return this;
  }

  /**
   * Enables this component.
   * @since 1.0.0
   */
  public enable(): this {
    this.enabled = true;
    this.handler.emit("moduleEnabled", this);
    return this;
  }

  /**
   * Reloads this module.
   * @since 1.0.0
   */
  public async reload(): Promise<Module> {
    const mod = await this.handler.load(this._loc[0], this._loc[1]);
    if (!mod) return this;
    await mod.init();
    return mod;
  }

  /**
   * Unloads this module.
   * @since 1.0.0
   */
  public unload(): Module {
    this.handler.emit("moduleUnloaded", this);
    return this.handler.remove(this)!;
  }

  /**
   * @param handler
   * @param dir
   * @param file
   */
  protected _patch(handler: Handler<Module>, dir: string, file: string[]): this {
    this._loc = [ dir, file ];
    this.handler = handler;
    this.path = join(dir, ...file);
    this.categoryId = this.categoryId ?? file.slice(0, -1)[0] ?? "general";
    this.id = this.id ?? file[file.length - 1].slice(0, -3);
    this.logger = new Logger(handler.name, { defaults: { name: `${this.categoryId}.${this.id}` } });

    return this;
  }
}

export type ModuleResolvable<T extends Module = Module> = string | T;

export interface ModuleOptions {
  id?: string;
  enabled?: boolean;
  category?: string;
}
