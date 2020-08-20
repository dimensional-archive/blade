import { Client, ClientOptions, Store } from "@kyudiscord/neo";
import { dirname } from "path";
import { logger, ClientUtil } from "./util";

import type { Logger } from "@melike2d/logger";
import type { Handler } from "./components/base/Handler";
import type { Module } from "./components/base/Module";

export class BladeClient extends Client {
  /**
   * The logger for this client instance.
   */
  @logger(BladeClient) readonly logger!: Logger;

  /**
   * The options given to this client.
   */
  public options: BladeOptions;

  /**
   * The client utility for resolving different discord structures.
   */
  public util: ClientUtil;

  /**
   * Handlers that were registered to this client.
   */
  public handlers: Store<string, Handler<Module>>;

  /**
   * @param options
   */
  public constructor(options: BladeOptions) {
    super(options.token, options);

    this.handlers = new Store();
    this.options = options;
    this.util = new ClientUtil();
  }

  /**
   * The user directory for loading components.
   */
  public get userDirectory(): string {
    return this.options.directory ?? dirname(require.main?.filename as string);
  }
}

export interface BladeOptions extends ClientOptions {
  token: string;
  directory?: string;
}
