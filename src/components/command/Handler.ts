import { CommandDispatcher, DispatcherOptions } from "./Dispatcher";
import { blade } from "../../util";
import { Command } from "./Command";

import type { HandlerOptions } from "../base/Handler";
import type { BladeClient } from "../../Client";

export class CommandHandler extends blade.get("Handler")<Command> {
  /**
   * The command dispatcher.
   */
  public readonly dispatcher: CommandDispatcher;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: CommandHandlerOptions = {}) {
    super(client, "commands", {
      ...options,
      class: Command
    });

    this.dispatcher = new CommandDispatcher(this, options.dispatcher);
  }

}

export interface CommandHandlerOptions extends HandlerOptions {
  dispatcher?: DispatcherOptions;
}
