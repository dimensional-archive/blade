import { Handler, HandlerOptions } from "../base/Handler";
import { Inhibitor, InhibitorType } from "./Inhibitor";
import { isPromise } from "../../util";

import type { BladeClient } from "../../Client";
import type { Context } from "../command/context/Context";
import type { Command } from "../command/Command";

export class InhibitorHandler extends Handler<Inhibitor> {
  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: HandlerOptions = {}) {
    super(client, "inhibitors", {
      ...options,
      class: Inhibitor
    });
  }

  /**
   * Tests inhibitors.
   * @param type The type of inhibitors to test.
   * @param ctx
   * @param command
   */
  public async test(type: InhibitorType, ctx: Context, command?: Command): Promise<string | void | null> {
    if (!this.store.size) return;

    const inhibitors = this.store.filter(i => i.type === type);
    if (!inhibitors.size) return;

    const promises = [];
    for (const [ , inhibitor ] of inhibitors) {
      const v = await (async () => {
        let inhibited: unknown = inhibitor._run(ctx, command);
        if (isPromise(inhibited)) inhibited = await inhibited;
        return inhibited ? inhibitor : null;
      })();

      promises.push(v);
    }

    const inhibited = (await Promise.all(promises)).map(p => p);
    if (!inhibited.length) return null;
    return inhibited.sort((a, b) => b!.priority - a!.priority)[0]!.reason;
  }
}