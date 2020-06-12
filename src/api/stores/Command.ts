import { Command } from "../components/command/Command";
import { ComponentStore, ComponentStoreOptions } from "./Base";
import { Util } from "../..";

import type { BladeClient } from "../Client";
import type { Message } from "eris";

export type IgnorePermissions = (message: Message) => boolean;
export type IgnoreCooldown = (message: Message) => boolean;

export interface HandlingOptions {
  /**
   * Whether to handle command edits.
   */
  handleEdits?: boolean;
  /**
   * Whether you want the command handling enabled or not.
   */
  enabled?: boolean;
  /**
   * Whether to allow bot accounts to run commands.
   */
  allowBots?: boolean;
  /**
   * Whether to allow the client to run commands.
   */
  allowSelf?: boolean;
  /**
   * Whether to allow users to run commands.
   */
  allowUsers?: boolean;
  /**
   * ID of user(s) to ignore `userPermissions` checks or a function to ignore.
   */
  ignorePermissions?: string | string[] | IgnorePermissions;
  /**
   * ID of user(s) to ignore cooldown or a function to ignore.
   */
  ignoreCooldown?: string | string[] | IgnoreCooldown;
  /**
   * Whether to store messages.
   */
  storeMessages?: boolean;
}

export interface CommandStoreOptions extends ComponentStoreOptions {
  /**
   * Message handling options.
   */
  handling?: HandlingOptions;
  /**
   * The default command cooldown.
   */
  defaultCooldown?: number;
}

/**
 * A command store that handles loading of commands.
 */
export class CommandStore extends ComponentStore<Command> {
  /**
   * Settings to use while handling
   * @since 1.0.0
   */
  public handling: HandlingOptions;
  /**
   * The default command cooldown.
   * @since 1.0.0
   * @default 5 seconds
   */
  public defaultCooldown: number;

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

    this.handling = Util.deepAssign(<HandlingOptions>{
      allowBots: false,
      allowSelf: false,
      allowUsers: true,
      enabled: true,
      ignoreCooldown: "",
      ignorePermissions: "",
      storeMessages: true,
      handleEdits: true
    }, options.handling ?? {})

    this.defaultCooldown = options.defaultCooldown ?? 5000;

    if (this.handling.enabled) {
      this.client.once("ready", () => {
        this.client.on("messageCreate", message => this.handle(message))

        if (this.handling.handleEdits) {
          this.client.on("messageUpdate", async (o, m) => {
            if (o.content === m?.content) return;
            if (this.handling.handleEdits) await this.handle(o);
          });
        }
      })
    }
  }

  /**
   * Handles a sent message.
   * @param message The received message.
   * @since 1.0.0
   */
  public async handle(message: Message): Promise<void> {
    // if (message.author.bot) {
    //   if (message.author.id !== this.client.user.id && !this.handling.allowBots) return;
    //   else if (!this.handling.allowSelf) return;
    // }


  }
}
