import { Component, ComponentOptions } from "../Base";
import { Util } from "../../../utils/Util";
import { Context } from "./Context";
import { MethodNotImplementedError } from "@ayanaware/errors";

import type { CommandStore } from "../../stores/Command";
import type { Permission } from "eris";
import type { MessageContent } from "eris";

export type CooldownType = "user" | "channel" | "guild";
export type ArgumentDefault = (ctx: Context) => any | Promise<any>;
export type PromptMessage = (ctx: Context) => MessageContent | Promise<MessageContent>;
export type Restrictions = "developer" | "admin" | "moderator" | "dj";
export type AllowedChannels = "text" | "dm";

export interface ArgumentPromptOptions {
  /**
   * The start message.
   */
  start?: MessageContent | PromptMessage;
  /**
   * The retry message.
   */
  retry?: MessageContent | PromptMessage;
  /**
   * The amount of tries this argument will use before giving up.
   */
  tries?: number;
}

export interface CommandArgument {
  /**
   * The Id of this argument.
   */
  id: string;
  /**
   * The default value for this argument.
   */
  default?: any | ArgumentDefault;
  /**
   * This type of argument.
   */
  type: string;
  /**
   * Whether to prompt the user if the argument was omitted.
   */
  prompt?: ArgumentPromptOptions;
}

export interface CommandDescription {
  /**
   * The description content.
   */
  content?: string;
  /**
   * Extended help for this command.
   */
  extendedContent?: string;
  /**
   * How to use this command.
   */
  usage?: string;
  /**
   * Examples of this command.
   */
  examples?: string[];
}

export interface CommandOptions extends ComponentOptions {
  /**
   * Description of the command.
   */
  description?: CommandDescription;
  /**
   * The command arguments.
   */
  args?: CommandArgument[];
  /**
   * Command Restrictions
   */
  restrictions?: Restrictions | Restrictions[];
  /**
   * Channel types that the command can be ran in.
   */
  channel?: AllowedChannels | AllowedChannels[];
  /**
   * Permissions needed by the invoker.
   */
  userPermissions?: Permission | Permission[];
  /**
   * Permissions needed by the client.
   */
  permissions?: Permission | Permission[];
  /**
   * Per-Command inhibitors to use.
   */
  inhibitors?: string | string[];
  /**
   * Whether this command is editable or not.
   */
  editable?: boolean;
  /**
   * The amount of times the command can be ran before being ratelimited.
   */
  ratelimit?: number;
  /**
   * The cooldown for this command.
   */
  cooldown?: number;
  /**
   * The cooldown type for this command.
   */
  cooldownType?: CooldownType;
  /**
   * Whether this command his hidden or not.
   */
  hidden?: boolean;
  /**
   * Whether this command is guarded or not.
   */
  guarded?: boolean
}


/**
 * The base command class.
 * @since 1.0.0
 */
export class Command extends Component {
  /**
   * The command store.
   * @since 1.0.0
   */
  public readonly store!: CommandStore;

  /**
   * This commands description.
   * @since 1.0.0
   */
  public description: CommandDescription;
  /**
   * The arguments for this command.
   * @since 1.0.0
   */
  public args: CommandArgument[];
  /**
   * Restrictions for this command.
   * @since 1.0.0
   */
  public restrictions: Restrictions[];
  /**
   * The channel types allowed to run this command.
   * @since 1.0.0
   */
  public channel: AllowedChannels[];
  /**
   * Permissions the invoker needs to run this command.
   * @since 1.0.0
   */
  public userPermissions: Permission[];
  /**
   * Permissions the bot needs before running this command.
   * @since 1.0.0
   */
  public permissions: Permission[];
  /**
   * Per-command inhibitors to run.
   * @since 1.0.0
   */
  public inhibitors: string[];
  /**
   * Whether this command can be edited or not.
   * @since 1.0.0
   */
  public editable: boolean;
  /**
   * The amount of times the command can be ran before being ratelimited.
   * @since 1.0.0
   */
  public ratelimit: number;
  /**
   * The cooldown for this command.
   * @since 1.0.0
   */
  public cooldown: number;
  /**
   * The cooldown type for this command.
   * @since 1.0.0
   */
  public cooldownType: CooldownType;
  /**
   * Whether this command his hidden or not.
   * @since 1.0.0
   */
  public hidden: boolean;
  /**
   * Whether this command is guarded or not.
   * @since 1.0.0
   */
  public guarded: boolean

  /**
   * Creates a new Command.
   * @param store The command store.
   * @param dir The directory that holds this command/
   * @param file The path to this command.
   * @param options Options to use.
   */
  public constructor(store: CommandStore, dir: string, file: string[], options: CommandOptions = {}) {
    super(store, dir, file, options);

    this.description = options.description ?? {}
    this.args = options.args ?? [];
    this.restrictions = options.restrictions ? Util.array(options.restrictions) : [];
    this.channel = options.channel ? Util.array(options.channel) : [ "dm", "text" ];
    this.userPermissions = options.userPermissions ? Util.array(options.userPermissions) : [];
    this.permissions = options.permissions ? Util.array(options.permissions) : [];
    this.inhibitors = options.inhibitors ? Util.array(options.inhibitors) : [];
    this.editable = options.editable ?? true;
    this.ratelimit = options.ratelimit ?? 1;
    this.cooldown = options.cooldown ?? 5000;
    this.cooldownType = options.cooldownType ?? "user";
    this.hidden = options.hidden ?? false;
    this.guarded = options.guarded ?? false;
  }

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating this command.
   * @constructor
   */
  public static Setup(options: CommandOptions = {}): <T extends new (...args: any[]) => Component>(t: T) => T {
    return Component.Setup(options);
  }

  /**
   * Executes this command.
   * @param ctx The message context for this execution.
   * @param args The parsed arguments.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exec(ctx: Context, args?: []): Promise<any> {
    throw new MethodNotImplementedError();
  }
}
