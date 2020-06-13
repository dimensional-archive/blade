import { ReplyBuilder } from "./ReplyBuilder";
import type { Message, MessageContent, TextableChannel, User } from "eris";
import { Guild, Member } from "eris";
import type { Command } from "./Command";
import type { BladeClient } from "../../Client";
import type { CommandStore } from "../../..";
import { EmbedBuilder } from "../../..";
export declare type Content = MessageContent | EmbedBuilder | ((builder: ReplyBuilder, ctx: Context) => ReplyBuilder | Promise<ReplyBuilder>);
export interface ContextData {
    afterPrefix?: string;
    alias?: string;
    command?: Command;
    content?: string;
    prefix?: string;
}
export declare class Context {
    readonly store: CommandStore;
    readonly client: BladeClient;
    readonly message: Message;
    /** Stuff */
    command?: Command;
    parsed?: ContextData;
    /** Command Editing Stuff. */
    shouldEdit: boolean;
    lastResponse?: Message;
    messages: Map<string, Message> | null;
    constructor(store: CommandStore, message: Message);
    /**
     * Returns the guild in which this message was sent in.
     * @since 1.0.0
     */
    get guild(): Guild | undefined;
    /**
     * Returns the author of the message.
     * @since 1.0.0
     */
    get author(): User;
    /**
     * Returns the member who sent the message if any.
     * @since 1.0.0
     */
    get member(): Member | undefined;
    /**
     * Returns the channel this message was sent in.
     * @since 1.0.0
     */
    get channel(): TextableChannel;
    /**
     * Returns the client as a guild member.
     * @since 1.0.0
     */
    get me(): Member;
    /**
     * Transforms any reply builders.
     * @since 1.0.0
     */
    static getTransformed(context: Context, message: Content): Promise<MessageContent>;
    /**
     * Sends a response or edits an old response if available.
     * @param content The content of the response.
     * @since 1.0.0
     */
    reply(content: Content): Promise<Message>;
    /**
     * Sends a response, overwriting the last response.
     * @param content The content to send.
     * @since 1.0.0
     */
    sendNew(content: Content): Promise<Message>;
    /**
     * Edits the last response.
     * @param content Edit content.
     * @since 1.0.0
     */
    edit(content: Content): Promise<Message>;
    /**
     * Adds client prompt or user reply to messages.
     * @param message Message(s) to add.
     */
    addMessage(message: Message | Message[]): Message | Message[];
    /**
     * Sets the last response.
     * @param message Response to set.
     * @since 1.0.0
     */
    setLastResponse(message: Message | Message[]): Message;
    /**
     * Changes if the message should be edited.
     * @param state Whether the message should be editable or not.
     * @since 1.0.0
     */
    setEditable(state: boolean): this;
}
