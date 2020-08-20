import { Module, ModuleOptions } from "../base/Module";

import type { Context } from "../command/context/Context";
import type { Command } from "../command/Command";
import type { BladeClient } from "../../Client";

export class Inhibitor extends Module<InhibitorOptions> {
  /**
   * The typeof inhibitor this is.
   */
  public type: InhibitorType;

  /**
   * The priority of this inhibitor.
   */
  public priority: number;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: InhibitorOptions = {}) {
    super(client, options);

    this.type = options.type ?? "command";
    this.priority = options.priority ?? 0;
  }

  /**
   * The reason to use when this inhibitor trips.
   */
  public get reason(): string {
    return this.options.reason ?? this.id;
  }

  /**
   * Run this inhibitor.
   * @param ctx The context instance.
   * @param command The command if the type of this inhibitor is not "all"
   */
  public run(ctx: Context, command?: Command): boolean | unknown | Promise<boolean | unknown> {
    void ctx;
    void command;
    return;
  }

  /**
   * @private
   */
  async _run(ctx: Context, command?: Command): Promise<boolean | unknown> {
    try {
      return this.run(ctx, command);
    } catch (e) {
      return false;
    }
  }

}

/**
 * A helper decorator for applying options to a inhibitor.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function inhibitor(options: InhibitorOptions = {}) {
  return <T extends new (...args: any[]) => Inhibitor>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

/**
 * The type of inhibitor
 * - "command": Runs on messages that invoke a command.
 * - "all": Runs on all messages.
 * - "pre-command": Runs before the message is checked if the message invokes a command..
 */
export type InhibitorType = "command" | "all" | "pre-command";

export interface InhibitorOptions extends ModuleOptions {
  type?: InhibitorType;
  reason?: string;
  priority?: number;
}

