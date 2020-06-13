import { EventIterator, EventIteratorOptions } from '@klasa/event-iterator';
import { Message, PrivateChannel, TextableChannel } from "eris";
export declare type MessageIteratorOptions = EventIteratorOptions<[Message]>;
/**
 * An asynchronous iterator responsible for iterating over messages.
 * @since 1.0.0
 */
export declare class MessageIterator extends EventIterator<[Message]> {
    /**
     * Construct's a new MessageIterator.
     * @param channel The channel to listen for messages.
     * @param options Any additional options to pass.
     * @since 1.0.0
     */
    constructor(channel: TextableChannel | PrivateChannel, options?: MessageIteratorOptions);
}
