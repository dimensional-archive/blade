import { join } from "path";

import type { ComponentStore } from "../stores/Base";
import type { BladeClient } from "../Client";
import { Logger } from "@ayanaware/logger";

export interface ComponentOptions {
  name?: string;
  disabled?: boolean;
  category?: string;
}

/**
 * An abstracted base class for all components like Command and Listener.
 * @since 1.0.0
 * @abstract
 */
export abstract class Component {
  /**
   * This components logger.
   * @since 1.0.4
   */
  public readonly logger: Logger;
  /**
   * The blade client.
   * @since 1.0.0
   */
  public readonly client: BladeClient;
  /**
   * THe store this component belongs to
   * @since 1.0.0
   */
  public readonly store: ComponentStore<Component>;

  /**
   * The file array of this component.
   * @since 1.0.0
   */
  public file: string[];
  /**
   * The directory that holds this component.
   * @since 1.0.0
   */
  public directory: string;
  /**
   * THe name of this component
   * @since 1.0.0
   */
  public name: string;
  /**
   * Whether this component is disabled or not
   * @since 1.0.0
   */
  public disabled: boolean;
  /**
   * The full category of this component.
   * @since 1.0.0
   */
  public fullCategory: string[];

  protected constructor(store: ComponentStore<Component>, directory: string, file: string[], options: ComponentOptions = {}) {
    options = Object.assign(options, Component._defaults);

    this.file = file;
    this.directory = directory;
    this.name = options.name ?? file[file.length - 1].slice(0, -3);
    this.disabled = options.disabled ?? false;
    this.fullCategory = file.slice(0, -1);

    this.client = store.client;
    this.store = store;
    this.logger = Logger.custom(this.name, "@kyu/blade", () => `${store.name}.${this.category}.`)
  }

  private static _defaults: ComponentOptions = {
    disabled: false,
    category: "General"
  }

  public static set defaults(defaults: ComponentOptions) {
    this._defaults = defaults;
  }

  /**
   * The full path of this component
   * @since 1.0.0
   */
  public get path(): string {
    return join(this.directory, ...this.file);
  }

  /**
   * The category of this component.
   * @since 1.0.0
   */
  public get category(): string {
    return this.fullCategory[0] ?? "General";
  }

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating the component
   * @constructor
   */
  public static Setup(options: ComponentOptions = {}) {
    return function <T extends new (...args: any[]) => Component>(t: T): T {
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
  public init(client: BladeClient): void {
    return;
  }

  /**
   * Reloads this piece.
   * @since 1.0.0
   */
  public async reload(): Promise<Component> {
    const component = await this.store.load(this.directory, this.file);
    await component.init(this.client);
    if (this.store.emit("compReloaded")) this.store.emit('compReloaded', component);
    return component;
  }


  /**
   * Remove this piece from the store.
   * @since 1.0.0
   */
  public unload(): Component | null {
    if (this.store.handlerCount('compUnloaded')) this.store.emit('compUnloaded', this);
    return this.store.remove(this);
  }

  /**
   * Disables this component.
   * @since 1.0.0
   */
  public disable(): this {
    this.disabled = true;
    // TODO create disable method in the Component Store
    return this;
  }

  /**
   * Enables this component.
   * @since 1.0.0
   */
  public async enable(): Promise<Component> {
    this.disabled = false;
    return this.store.load(this.directory, this.file);
  }
}