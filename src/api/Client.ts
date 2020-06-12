import { Client, ClientOptions } from "eris";
import { ComponentStore } from "./stores/Base";
import { Component } from "./components/Base";
import { IllegalStateError } from "@ayanaware/errors";
import { dirname } from "path";

export interface BladeClientOptions extends ClientOptions {
  directory?: string;
}

export class BladeClient extends Client {
  /**
   * The base directory of the bot.
   * @since 1.0.0
   */
  public directory: string;
  /**
   * Whether the client has been started or not.
   * @since 1.0.0
   */
  public started: boolean;
  /**
   * A set of stores that are being used by the client.
   * @since 1.0.0
   */
  private readonly _stores: Set<ComponentStore<Component>> = new Set();

  /**
   * Creates a new BladeClient.
   * @param token Your bot token.
   * @param options
   */
  public constructor(token: string, options: BladeClientOptions = {}) {
    super(token, options);

    this.directory = options.directory ?? dirname(require.main!.filename);
    this.started = false;
  }

  /**
   * Uses a store.
   * @param store The store to use.
   */
  public use(store: ComponentStore<Component>): this {
    if (this._stores.has(store)) {
      throw new IllegalStateError(`Store "${store.name ?? store.constructor.name}" is already being used.`);
    }

    this._stores.add(store);
    Object.defineProperty(this, store.name, { value: store });
    if (this.started) store.loadAll().then(() => true);

    return this;
  }

  /**
   * Starts the bot.
   * @since 1.0.0
   */
  public async start(): Promise<BladeClient> {
    await Promise.all([...this._stores].map(r => r.loadAll()));
    await this.connect();
    this.started = true;
    return this;
  }
}