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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9jb2xsZWN0b3JzL2l0ZXJhdG9ycy9NZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTRFO0FBSzVFOzs7R0FHRztBQUNILE1BQWEsZUFBZ0IsU0FBUSw4QkFBMEI7SUFFN0Q7Ozs7O09BS0c7SUFDSCxZQUFtQixPQUF5QyxFQUFFLFVBQWtDLEVBQUU7UUFDaEcsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLEdBQVksRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUU5RCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUU7WUFDckMsS0FBSztZQUNMLElBQUk7WUFDSixNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFqQkQsMENBaUJDIn0=