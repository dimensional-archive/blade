/**
 * Options for a MessageCollector.
 * @since 0.0.1
 */
import { Message, PrivateChannel, TextableChannel } from "eris";
import { Storage } from "../Storage";
import { Collector } from "./Collector";
import { MessageIterator } from "./iterators/Message";
export interface MessageCollectorOptions {
    /**
     * The amount of messages to collect before ending the collector.
     * @since 0.0.1
     */
    limit?: number;
    /**
     * The time in ms that a MessageCollector will go before idling out.
     * @since 0.0.1
     */
    idle?: number;
    /**
     * The filter used to filter out specific messages.
     * @since 0.0.1
     */
    filter?: (message: [Message], collected: Storage<string, Message>) => boolean;
}
/**
 * The MessageCollector class responsible for collecting a set of messages.
 * @since 0.0.1
 */
export declare class MessageCollector extends Collector<Message, [Message], MessageIterator> {
    /**
     * Construct's a new MessageCollector.
     * @since 0.0.1
     * @param channel The channel to listen for messages.
     * @param options Any additional options to pass.
     */
    constructor(channel: TextableChannel | PrivateChannel, options: MessageCollectorOptions);
}
