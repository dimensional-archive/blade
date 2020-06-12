import { Command } from "./Command";
import { ReplyBuilder } from "./ReplyBuilder";

import type { Guild, Member, Message, MessageContent, MessageFile, User, VoiceState } from "eris";
import type { BladeClient } from "../../Client";
import type { CommandStore } from "../../stores/Command";

export type Content = MessageContent | ((builder: ReplyBuilder, ctx: Context) => ReplyBuilder | Promise<ReplyBuilder>)

export interface ContextData {
  trigger?: string;
  prefix?: string;
  invoker?: string;
}

export class Context {
  public readonly store: CommandStore;
  public readonly client: BladeClient;
  public readonly message: Message;

  public author: User;
  public member?: Member;
  public guild?: Guild;
  public voice?: VoiceState;

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
    this.author = message.author;
    if (message.member) {
      this.member = message.member;
      this.guild = message.member.guild;
      this.voice = message.member.voiceState;
    }

    this.shouldEdit = false;

    if (store.storeMessages) this.messages = new Map();
  }

  /**
   * Transforms any reply builders.
   */
  public static async getTransformed(
    context: Context,
    message: MessageContent | ((builder: ReplyBuilder, ctx: Context) => ReplyBuilder | Promise<ReplyBuilder>),
    files: MessageFile[] = []
  ): Promise<[ MessageContent, MessageFile[] ]> {
    let transformedOptions: [ MessageContent, MessageFile[] ];

    if (typeof message === "function") {
      const builder = await message(new ReplyBuilder(context), context);
      transformedOptions = await builder.build();
    } else transformedOptions = [ message, files ];

    return transformedOptions
  }

  /**
   * Sends a response or edits an old response if available.
   * @param content The content of the response.
   * @param files Any files to send along with the response.
   */
  public async reply(content: Content, files: MessageFile[] = []): Promise<Message> {
    const transformed = Context.getTransformed(this, content, files);

    if (this.shouldEdit && (this.command ? this.command!.editable : true) && !this.lastResponse!.attachments.length) {
      return this.lastResponse!.edit(transformed[0]);
    }

    const sent = await this.message.channel.createMessage(transformed[0], transformed[1]);
    const lastSent = this.setLastResponse(sent);
    this.setEditable(!lastSent.attachments.length);

    return sent;
  }

  /**
   * Sends a response, overwriting the last response.
   * @param content The content to send.
   * @param files Any files to send.
   */
  public async sendNew(content: Content, files: MessageFile[] = []): Promise<Message> {
    const sent = await this.message.channel.createMessage(...await Context.getTransformed(this, content, files));
    const lastSent = this.setLastResponse(sent);

    this.setEditable(!lastSent.attachments.length);

    return sent;
  }

  /**
   * Edits the last response.
   * @param content Edit content.
   */
  public async edit(content: Content): Promise<Message> {
    const [ editContent ] = await Context.getTransformed(this, content)
    return this.lastResponse!.edit(editContent);
  }

  /**
   * Adds client prompt or user reply to messages.
   * @param message Message(s) to add.
   */
  public addMessage(message: Message | Message[]): Message | Message[] {
    if (this.store.storeMessages) {
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
   * @returns {Context}
   */
  public setEditable(state: boolean): this {
    this.shouldEdit = Boolean(state);
    return this;
  }
}