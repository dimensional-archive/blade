import { Logger } from "@ayanaware/logger";
import { join } from "path";

import type { BladeClient } from "../../Client";
import type { Store } from "./Store";

export interface PartOptions {
  name?: string;
  disabled?: boolean;
  category?: string;
}

/**
 * An abstracted base class for all parts like Command and Subscriber.
 * @since 1.0.0
 * @abstract
 */
export abstract class Part {
  /**
   * This parts logger.
   * @since 1.0.4
   */
  public readonly logger: Logger;
  /**
   * The blade client.
   * @since 1.0.0
   */
  public readonly client: BladeClient;
  /**
   * THe store this part belongs to
   * @since 1.0.0
   */
  public readonly store: Store<Part>;

  /**
   * The file array of this part.
   * @since 1.0.0
   */
  public file: string[];
  /**
   * The directory that holds this part.
   * @since 1.0.0
   */
  public directory: string;
  /**
   * The name of this part
   * @since 1.0.0
   */
  public name: string;
  /**
   * Whether this part is disabled or not
   * @since 1.0.0
   */
  public disabled: boolean;
  /**
   * The full category of this part.
   * @since 1.0.0
   */
  public fullCategory: string[];

  protected constructor(store: Store<Part>, directory: string, file: string[], options: PartOptions = {}) {
    options = Object.assign(options, Part._defaults);

    this.file = file;
    this.directory = directory;
    this.name = options.name ?? file[file.length - 1].slice(0, -3);
    this.disabled = options.disabled ?? false;
    this.fullCategory = file.slice(0, -1);

    this.client = store.client;
    this.store = store;
    this.logger = Logger.custom(this.name, "@kyu/blade", () => `${store.name}.${this.category}.`)
  }

  private static _defaults: PartOptions = {
    disabled: false,
    category: "General"
  }

  public static set defaults(defaults: PartOptions) {
    this._defaults = defaults;
  }

  /**
   * The full path of this part
   * @since 1.0.0
   */
  public get path(): string {
    return join(this.directory, ...this.file);
  }

  /**
   * The category of this part.
   * @since 1.0.0
   */
  public get category(): string {
    return this.fullCategory[0] ?? "General";
  }

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating the part
   * @constructor
   */
  public static Setup(options: PartOptions = {}) {
    return function <T extends new (...args: any[]) => Part>(t: T): T {
      return class extends t {
        constructor(...args: any[]) {
          super(...args, options);
        }
      }
    }
  }

  /**
   * Called once the bot is ready.
   */
  public init(...args: any[]): void {
    args;
    return;
  }

  /**
   * Reloads this piece.
   * @since 1.0.0
   */
  public async reload(): Promise<Part> {
    const part = await this.store.load(this.directory, this.file);
    await part.init(this.client);
    if (this.store.emit("compReloaded")) this.store.emit('compReloaded', part);
    return part;
  }


  /**
   * Remove this piece from the store.
   * @since 1.0.0
   */
  public unload(): Part | null {
    if (this.store.handlerCount('compUnloaded')) this.store.emit('compUnloaded', this);
    return this.store.remove(this);
  }

  /**
   * Disables this part.
   * @since 1.0.0
   */
  public disable(): this {
    this.store.emit("compDisabled", this);
    this.disabled = true;
    return this;
  }

  /**
   * Enables this part.
   * @since 1.0.0
   */
  public enable(): this {
    this.store.emit("compEnabled", this);
    this.disabled = false;
    return this;
  }
}