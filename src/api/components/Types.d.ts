import { MessageContent, Permission } from "eris";

export interface ComponentOptions {
  name?: string;
  disabled?: boolean;
  category?: string;
}

export interface ContextData {
  trigger?: string;
  prefix?: string;
  invoker?: string;
}

/** Command */

export type ArgumentDefault = (ctx: CommandContext) => any | Promise<any>;
export type PromptMessage = (ctx: CommandContext) => MessageContent | Promise<MessageContent>;
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
}


