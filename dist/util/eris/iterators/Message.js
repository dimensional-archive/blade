"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_iterator_1 = require("@klasa/event-iterator");
/**
 * An asynchronous iterator responsible for iterating over messages.
 * @since 1.0.0
 */
class MessageIterator extends event_iterator_1.EventIterator {
    /**
     * Construct's a new MessageIterator.
     * @param channel The channel to listen for messages.
     * @param options Any additional options to pass.
     * @since 1.0.0
     */
    constructor(channel, options = {}) {
        const { limit, idle, filter = () => true } = options;
        super(channel.client, "messageCreate", {
            limit,
            idle,
            filter: ([message]) => message.channel === channel && filter([message])
        });
    }
}
exports.MessageIterator = MessageIterator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlsL2VyaXMvaXRlcmF0b3JzL01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBNEU7QUFLNUU7OztHQUdHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLDhCQUEwQjtJQUU3RDs7Ozs7T0FLRztJQUNILFlBQW1CLE9BQXlDLEVBQUUsVUFBa0MsRUFBRTtRQUNoRyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsR0FBWSxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRTlELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRTtZQUNyQyxLQUFLO1lBQ0wsSUFBSTtZQUNKLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpCRCwwQ0FpQkMifQ==