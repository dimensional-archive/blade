import { EventIterator, EventIteratorOptions } from '@klasa/event-iterator';
import { Message, PrivateChannel, TextableChannel } from "@kyu/eris";

export type MessageIteratorOptions = EventIteratorOptions<[ Message ]>;

/**
 * An asynchronous iterator responsible for iterating over messages.
 * @since 1.0.0
 */
export class MessageIterator extends EventIterator<[ Message ]> {

  /**
   * Construct's a new MessageIterator.
   * @param channel The channel to listen for messages.
   * @param options Any additional options to pass.
   * @since 1.0.0
   */
  public constructor(channel: TextableChannel | PrivateChannel, options: MessageIteratorOptions = {}) {
    const { limit, idle, filter = (): boolean => true } = options;

    super(channel.client, "messageCreate", {
      limit,
      idle,
      filter: ([message]): boolean => message.channel === channel && filter([message])
    });
  }
}
