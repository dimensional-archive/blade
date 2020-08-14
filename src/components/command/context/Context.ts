import { Params } from "./Params";
import { Flags } from "./Flags";

import type { Message, Member, Guild, User, TextBasedChannel, Embed } from "@kyudiscord/neo";
import type { CommandDispatcher } from "../Dispatcher";
import type { BladeClient } from "../../../Client";

export class Context {
  /**
   * The message.
   */
  public readonly message: Message;

  /**
   * The client.
   */
  public readonly client: BladeClient;

  /**
   * Parsed Parameters for this invocation
   */
  public params: Params;

  /**
   * Parsed flags for this invocation.
   */
  public flags: Flags;

  /**
   * The author of this message.
   */
  public author: User;

  /**
   * The invoker.
   */
  public member: Member | null;

  /**
   * The guild this message was sent in.
   */
  public guild: Guild | null;

  /**
   * The channel this message sent in.
   */
  public channel: TextBasedChannel;

  /**
   * Whether or not the last response should be edited.
   */
  public shouldEdit: boolean;

  /**
   * The last response.
   */
  public lastResponse?: Message;

  /**
   * All responses..
   */
  public messages: Map<string, Message>;

  /**
   * Parsing index.
   */
  public parseIndex: number;

  /**
   * @param dispatcher
   * @param message
   */
  public constructor(dispatcher: CommandDispatcher, message: Message) {
    this.message = message;
    this.client = dispatcher.client;

    this.params = new Params();
    this.flags = new Flags();

    this.author = message.author;
    this.member = message.member;
    this.guild = message.guild;
    this.channel = message.channel;

    this.shouldEdit = false;
    this.messages = new Map();
    this.parseIndex = 0;

    this.reply = this.reply.bind(this);
    this.edit = this.edit.bind(this);
  }

  /**
   * Replies to the message.
   * @param content
   */
  public async reply(content: string | Embed): Promise<Message> {
    if (this.shouldEdit && !this.lastResponse?.attachments.size) {
      return this.edit(content);
    }

    const messages = await (typeof content === "string"
      ? this.channel.send(content)
      : this.channel.send(b => b.setEmbed(content)));

    const lastSent = this.setLastResponse(messages);
    this.setEditable(!lastSent.attachments.size);

    return messages[messages.length - 1];
  }

  /**
   * Edits the last response.
   * @param content Content to edit the message with.
   */
  public async edit(content: string | Embed): Promise<Message> {
    return typeof content === "string"
      ? this.lastResponse!.edit(content)
      : this.lastResponse!.edit(b => b.setEmbed(content));
  }

  /**
   * Sets the last response of this context.
   * @param message The last message.
   */
  private setLastResponse(message: Message | Message[]): Message {
    if (Array.isArray(message)) this.lastResponse = message.slice(-1)[0];
    else this.lastResponse = message;
    return this.lastResponse;
  }

  /**
   * Changes the should edit state of this context.
   * @param state Whether or not the message should be editable.
   */
  private setEditable(state: boolean): this {
    this.shouldEdit = state;
    return this;
  }
}
