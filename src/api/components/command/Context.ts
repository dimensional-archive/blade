import { ReplyBuilder } from "./ReplyBuilder";

import type { Message, MessageContent, TextableChannel, User } from "eris";
import { Guild, Member, TextChannel } from "eris";
import type { Command } from "./Command";
import type { BladeClient } from "../../Client";
import type { CommandStore } from "../../..";
import { EmbedBuilder } from "../../..";

export type Content =
  MessageContent
  | EmbedBuilder
  | ((builder: ReplyBuilder, ctx: Context) => ReplyBuilder | Promise<ReplyBuilder>)

export interface ContextData {
  afterPrefix?: string;
  alias?: string;
  command?: Command;
  content?: string;
  prefix?: string;
}

export class Context {
  public readonly store: CommandStore;
  public readonly client: BladeClient;
  public readonly message: Message;

  /** Stuff */
  public command?: Command;
  public parsed?: ContextData;

  /** Command Editing Stuff. */
  public shouldEdit: boolean;
  public lastResponse?: Message;
  public messages: Map<string, Message> | null = null;

  public constructor(store: CommandStore, message: Message) {
    this.store = store;
    this.client = store.client;
    this.message = message;
    this.shouldEdit = false;
    if (store.handling.storeMessages) this.messages = new Map();
  }

  /**
   * Returns the guild in which this message was sent in.
   * @since 1.0.0
   */
  public get guild(): Guild | undefined {
    return this.message.channel instanceof TextChannel
      ? this.message.channel.guild
      : undefined;
  }

  /**
   * Returns the author of the message.
   * @since 1.0.0
   */
  public get author(): User {
    return this.message.author;
  }

  /**
   * Returns the member who sent the message if any.
   * @since 1.0.0
   */
  public get member(): Member | undefined {
    return this.guild
      ? this.guild.members.get(this.author.id)
      : undefined;
  }

  /**
   * Returns the channel this message was sent in.
   * @since 1.0.0
   */
  public get channel(): TextableChannel {
    return this.message.channel;
  }

  /**
   * Returns the client as a guild member.
   * @since 1.0.0
   */
  public get me(): Member {
    return this.guild!.members.get(this.client.user.id)!
  }

  /**
   * Transforms any reply builders.
   * @since 1.0.0
   */
  public static async getTransformed(
    context: Context,
    message: Content,
  ): Promise<MessageContent> {
    let transformedOptions: MessageContent;

    if (typeof message === "function") {
      const builder = await message(new ReplyBuilder(context), context);
      transformedOptions = (await builder.build())[0];
    } else if (message instanceof EmbedBuilder) transformedOptions = { embed: message.build() }
    else transformedOptions = message;

    return transformedOptions
  }

  /**
   * Sends a response or edits an old response if available.
   * @param content The content of the response.
   * @since 1.0.0
   */
  public async reply(content: Content): Promise<Message> {
    const transformed = await Context.getTransformed(this, content);

    if (this.shouldEdit && (this.command ? this.command!.editable : true) && !this.lastResponse!.attachments.length) {
      return this.lastResponse!.edit(transformed);
    }

    const sent = await this.message.channel.createMessage(transformed);
    const lastSent = this.setLastResponse(sent);
    this.setEditable(!lastSent.attachments.length);

    return sent;
  }

  /**
   * Sends a response, overwriting the last response.
   * @param content The content to send.
   * @since 1.0.0
   */
  public async sendNew(content: Content): Promise<Message> {
    const sent = await this.message.channel.createMessage(await Context.getTransformed(this, content));
    const lastSent = this.setLastResponse(sent);

    this.setEditable(!lastSent.attachments.length);

    return sent;
  }

  /**
   * Edits the last response.
   * @param content Edit content.
   * @since 1.0.0
   */
  public async edit(content: Content): Promise<Message> {
    const editContent = await Context.getTransformed(this, content)
    return this.lastResponse!.edit(editContent);
  }

  /**
   * Adds client prompt or user reply to messages.
   * @param message Message(s) to add.
   */
  public addMessage(message: Message | Message[]): Message | Message[] {
    if (this.store.handling.storeMessages) {
      if (Array.isArray(message)) {
        for (const msg of message) {
          this.messages!.set(msg.id, msg);
        }
      } else {
        this.messages!.set(message.id, message);
      }
    }

    return message;
  }

  /**
   * Sets the last response.
   * @param message Response to set.
   * @since 1.0.0
   */
  public setLastResponse(message: Message | Message[]): Message {
    if (Array.isArray(message)) {
      this.lastResponse = message.slice(-1)[0];
    } else {
      this.lastResponse = message;
    }

    return this.lastResponse;
  }

  /**
   * Changes if the message should be edited.
   * @param state Whether the message should be editable or not.
   * @since 1.0.0
   */
  public setEditable(state: boolean): this {
    this.shouldEdit = Boolean(state);
    return this;
  }

  /**
   * Get a translation string.
   * @param path The translation to get.
   * @param data
   * @since 1.0.5
   */
  public t<T = string>(path: string, data: Record<string, any> = {}): T {
    const lang = this.store.handling.getLanguage!(this);
    return typeof lang !== "string"
      ? lang.translate(path, data)
      : this.client.languages.translate(lang, path, data);
  }
}