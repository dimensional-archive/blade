import { config } from "@melike2d/logger";
import { Module } from "../base/Module";
import { isPromise } from "../../util";

import type { Message } from "@kyudiscord/neo";

export class Monitor extends Module {
  /**
   * Called whenever a message is received.
   * @param _message
   * @since 1.0.0
   */
  public run(_message: Message): unknown {
    return;
  }

  /**
   * @private
   */
  async _run(message: Message): Promise<void> {
    try {
      let resp = this.run(message);
      if (isPromise(resp)) resp = await resp;
      this.handler.emit("monitorRan", this, message, resp);
    } catch (e) {
      if (this.handler.listenerCount("monitorError")) {
        this.handler.emit("monitorError", e, this);
        return;
      }

      this.logger.error(config({ prefix: message.id }), e);
    }
  }
}
