import { Content, Context } from "../Context";
import { Message, MessageContent } from "@kyu/eris";
import { Flag } from "./Flag";

export interface ArgumentOptions {
  id?: string;
  match?: ArgumentMatch;
  flag?: string | string[];
  type?: ArgumentType | ArgumentTypeCaster;
  multipleFlags?: boolean;
  index?: number;
  unordered?: boolean | number | number[];
  limit?: number;
  default?: any | Supplier<FailureData, any>;
  otherwise?: Content | Supplier<FailureData, Content>;
  modifyOtherwise?: Modifier<FailureData, Content>;
  prompt?: ArgumentPromptOptions;
}

export interface ArgumentPromptData {
  retries: number;
  infinite: boolean;
  message: Message;
  phrase: string;
  failure: void | Flag;
}

export interface ArgumentPromptOptions {
  retries?: number;
  time?: number;
  cancelWord?: string;
  optional?: boolean;
  infinite?: boolean;
  limit?: number;
  breakout?: boolean;
  start?: MessageContent | Supplier<ArgumentPromptData, Content>;
  retry?: MessageContent | Supplier<ArgumentPromptData, Content>;
  timeout?: MessageContent | Supplier<ArgumentPromptData, Content>;
  ended?: MessageContent | Supplier<ArgumentPromptData, Content>;
  cancel?: MessageContent | Supplier<ArgumentPromptData, Content>;
  stopWord?: string;
  modifyStart?: Modifier<ArgumentPromptData, Content>;
  modifyRetry?: Modifier<ArgumentPromptData, Content>;
  modifyTimeout?: Modifier<ArgumentPromptData, Content>;
  modifyEnded?: Modifier<ArgumentPromptData, Content>;
  modifyCancel?: Modifier<ArgumentPromptData, Content>;
}

export interface FailureData {
  phrase: string;
  failure: void | Flag;
}

export interface DefaultArgumentOptions {
  prompt?: ArgumentPromptOptions;
  otherwise?: Content | Supplier<FailureData, Content>;
  modifyOtherwise?: Modifier<FailureData, Content>;
}

export type ArgumentMatch =
  | "phrase"
  | "flag"
  | "option"
  | "rest"
  | "separate"
  | "text"
  | "content"
  | "restContent"
  | "none";
export type ArgumentType =
  | "string"
  | "lowercase"
  | "uppercase"
  | "charCodes"
  | "number"
  | "integer"
  | "bigint"
  | "emojint"
  | "url"
  | "date"
  | "color"
  | "user"
  | "users"
  | "member"
  | "members"
  | "relevant"
  | "relevants"
  | "channel"
  | "channels"
  | "textChannel"
  | "textChannels"
  | "voiceChannel"
  | "voiceChannels"
  | "categoryChannel"
  | "categoryChannels"
  | "newsChannel"
  | "newsChannels"
  | "storeChannel"
  | "storeChannels"
  | "role"
  | "roles"
  | "emoji"
  | "emojis"
  | "guild"
  | "guilds"
  | "message"
  | "guildMessage"
  | "relevantMessage"
  | "invite"
  | "userMention"
  | "memberMention"
  | "channelMention"
  | "roleMention"
  | "emojiMention"
  | "commandAlias"
  | "command"
  | "inhibitor"
  | "listener"
  | (string | string[])[]
  | RegExp
  | string;

export type Modifier<D, T> = (ctx?: Context, text?: Content, data?: D) => T | Promise<T>;
export type Supplier<D, T> = (message: Message, data?: D) => T | Promise<T>;
export type ArgumentTypeCaster = (message: Message, value?: any) => any;
export type ParsedValuePredicate = (message?: Message, phrase?: string, value?: any) => boolean;