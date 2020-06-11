import { Command } from "../components/command/Command";
import { ComponentStore } from "./Base";

import type { CommandStoreOptions } from "./Types";
import type { BladeClient } from "../Client";

export class CommandStore extends ComponentStore<Command> {
  public storeMessages: boolean;

  public constructor(client: BladeClient, options: CommandStoreOptions) {
    super(client, "commands", {
      ...options,
      classToHandle: Command
    });

    this.storeMessages = options.storeMessages ?? true;
  }
}
