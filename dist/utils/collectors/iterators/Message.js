"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageIterator = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9jb2xsZWN0b3JzL2l0ZXJhdG9ycy9NZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBEQUE0RTtBQUs1RTs7O0dBR0c7QUFDSCxNQUFhLGVBQWdCLFNBQVEsOEJBQTBCO0lBRTdEOzs7OztPQUtHO0lBQ0gsWUFBbUIsT0FBeUMsRUFBRSxVQUFrQyxFQUFFO1FBQ2hHLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxHQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFFOUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFO1lBQ3JDLEtBQUs7WUFDTCxJQUFJO1lBQ0osTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBVyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakYsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBakJELDBDQWlCQyJ9