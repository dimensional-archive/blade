import { Command } from "../components/command/Command";
import { ComponentStore, ComponentStoreOptions } from "./Base";

import type { BladeClient } from "../Client";

export interface CommandStoreOptions extends ComponentStoreOptions {
  storeMessages?: boolean;
}

/**
 * A command store that handles loading of commands.
 */
export class CommandStore extends ComponentStore<Command> {
  /**
   * Whether to store messages in context classes.
   * @since 1.0.0
   */
  public storeMessages: boolean;

  /**
   * Creates a new Command Store
   * @param client The client that is using this command store.
   * @param options The options to give.
   */
  public constructor(client: BladeClient, options: CommandStoreOptions = {}) {
    super(client, "commands", {
      ...options,
      classToHandle: Command
    });

    this.storeMessages = options.storeMessages ?? true;
  }
}
