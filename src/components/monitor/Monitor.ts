import { MessageType } from "@kyudiscord/dapi";
import { config } from "@melike2d/logger";
import { Module, ModuleOptions } from "../base/Module";
import { isPromise, mergeObjects } from "../../util";

import type { Message } from "@kyudiscord/neo";
import type { BladeClient } from "../../Client";

export class Monitor extends Module<MonitorOptions> {
  /**
   * Different things to ignore.
   */
  public ignore: MonitorIgnore;

  /**
   * The allowed types of message.
   */
  public allowedTypes: MessageType[];

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: MonitorOptions = {}) {
    super(client, options);

    const ignoreTypes = [ "bots", "self", "others", "webhooks", "edits" ];
    this.allowedTypes = options.allowedTypes ?? [ MessageType.DEFAULT ];
    this.ignore = options.ignore ?? mergeObjects<MonitorIgnore>(...ignoreTypes.map(s => ({ [s]: true })));
  }


  /**
   * Called whenever a message is received.
   * @param message
   * @since 1.0.0
   */
  public run(message: Message): unknown {
    void message;
    return;
  }

  /**
   * @private
   */
  async _run(message: Message): Promise<void> {
    try {
      let resp = this.run(message);
      if (isPromise(resp)) resp = await resp;
      void this.handler.emit("monitorRan", this, message, resp);
    } catch (e) {
      if (this.handler.listenerCount("monitorError")) {
        void this.handler.emit("monitorError", e, this);
        return;
      }

      void this.logger.error(config({ prefix: message.id }), e);
    }
  }
}

export interface MonitorOptions extends ModuleOptions {
  /**
   * Types of messages
   */
  allowedTypes?: MessageType[];
  /**
   * Things to ignore.
   */
  ignore?: MonitorIgnore;
}

export interface MonitorIgnore {
  bots?: boolean;
  self?: boolean;
  others?: boolean;
  webhooks?: boolean;
  edits?: boolean;
}
