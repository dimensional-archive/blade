import { Client, ClientOptions } from "@kyudiscord/neo";
import { dirname } from "path";
import { logger } from "./util";

import type { Logger } from "@melike2d/logger";

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
   * @param options
   */
  public constructor(options: BladeOptions) {
    super(options.token, options);

    this.options = options;
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
