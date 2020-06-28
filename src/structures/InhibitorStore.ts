import { Store, StoreOptions } from "./base/Store";
import { Inhibitor, InhibitorType } from "./Inhibitor";

import type { BladeClient } from "../Client";
import { Message } from "eris";
import { Command, Util } from "..";

export class InhibitorStore extends Store<Inhibitor> {
  constructor(client: BladeClient, options: StoreOptions = {}) {
    super(client, "inhibitors", {
      classToHandle: Inhibitor,
      ...options
    });
  }

  /**
   * Tests inhibitors against the message.
   * @param type The type of inhibitors to test.
   * @param message Message to test.
   * @param command Command to use.
   */
  public async test(type: InhibitorType, message: Message, command?: Command): Promise<string | null> {
    if (!this.parts.size) return null;

    const inhibitors = this.parts.filter(i => i.type === type && (i.type === "command" ? command!.inhibitors.includes(i.name) : false));
    if (!inhibitors.size) return null;

    const promises: Promise<any>[] = [];

    for (const inhibitor of inhibitors.values()) {
      promises.push((async () => {
        let inhibited = inhibitor["run"](message, command);
        if (Util.isPromise(inhibited)) inhibited = await inhibited;
        if (inhibited) return inhibitor;
        return null;
      })());
    }

    const inhibitedInhibitors = (await Promise.all(promises)).filter(r => r);
    if (!inhibitedInhibitors.length) return null;

    inhibitedInhibitors.sort((a, b) => b.priority - a.priority);
    return inhibitedInhibitors[0].reason;
  }
}