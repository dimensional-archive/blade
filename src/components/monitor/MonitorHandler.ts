import { Monitor } from "./Monitor";
import { Handler, HandlerOptions } from "../base/Handler";

import type { BladeClient } from "../../Client";

export class MonitorHandler extends Handler<Monitor> {
  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: HandlerOptions) {
    super(client, "monitors", {
      ...options,
      class: Monitor
    });

    client.on("messageCreate", async (message) => {
      let count = 0;
      for (const monitor of this.store.values()) {
        if (!monitor.enabled) continue;
        await monitor._run(message);
        count++;
      }

      this.emit("monitorsRan", count);
    });
  }
}