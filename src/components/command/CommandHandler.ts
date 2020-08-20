import { Store } from "@kyudiscord/neo";
import { CommandDispatcher, DispatcherOptions } from "./CommandDispatcher";
import { Command } from "./Command";
import { Handler, HandlerOptions } from "../base/Handler";
import { Category } from "../../util";

import type { BladeClient } from "../../Client";
import type { ModuleResolvable } from "../base/Module";

export class CommandHandler extends Handler<Command> {
  /**
   * The command dispatcher.
   */
  public readonly dispatcher: CommandDispatcher;

  /**
   * The command categories.
   */
  public readonly categories: Store<string, Category<Command>>;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: CommandHandlerOptions = {}) {
    super(client, "commands", {
      ...options,
      class: Command
    });

    this.categories = new Store();
    this.dispatcher = new CommandDispatcher(this, options.dispatcher);
  }

  /**
   * Adds a new command to the command store.
   * @param module The command to add.
   * @param reload Whether or not the command was reloaded.
   */
  public add(module: Command, reload = false): Command | null {
    const command = super.add(module, reload);
    if (command) {
      const category = this.categories.get(command.categoryId) ??
        new Category(this, command.categoryId);

      void this.categories.set(category.id, category.set(command.id));
      return command;
    }

    return null;
  }

  /**
   * Removes a command from the commands store.
   * @param resolvable The command to remove.
   * @param emit Whether or not to emit the removed event.
   */
  public remove(resolvable: ModuleResolvable<Command>, emit = true): Command | null {
    const command = super.remove(resolvable, emit);
    if (command) {
      const category = this.categories.get(command.categoryId);
      if (category) {
        void category.delete(command.id);
        if (!category.size)
          void this.categories.delete(category.id);
      }

      return command;
    }

    return null;
  }
}

export interface CommandHandlerOptions extends HandlerOptions {
  dispatcher?: DispatcherOptions;
}
