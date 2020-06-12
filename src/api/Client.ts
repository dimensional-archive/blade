import { Client, ClientOptions } from "eris";
import { ComponentStore } from "./stores/Base";
import { Component } from "./components/Base";
import { IllegalStateError } from "@ayanaware/errors";
import { dirname } from "path";

export interface BladeClientOptions extends ClientOptions {
  directory?: string;
}

export class BladeClient extends Client {
  public directory: string;
  public started: boolean;
  private readonly _stores: Set<ComponentStore<Component>> = new Set();

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