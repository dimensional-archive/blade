"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collector_1 = require("./Collector");
const Message_1 = require("./iterators/Message");
/**
 * The MessageCollector class responsible for collecting a set of messages.
 * @since 0.0.1
 */
class MessageCollector extends Collector_1.Collector {
    /**
     * Construct's a new MessageCollector.
     * @since 0.0.1
     * @param channel The channel to listen for messages.
     * @param options Any additional options to pass.
     */
    constructor(channel, options) {
        if (!options.limit && !options.idle)
            throw new Error('Collectors need either a limit or idle, or they will collect forever.');
        const { limit, idle, filter = () => true } = options;
        super(new Message_1.MessageIterator(channel, {
            limit,
            idle,
            filter: ([message]) => filter([message], this.collected)
        }));
    }
}
exports.MessageCollector = MessageCollector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZUNvbGxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL2VyaXMvTWVzc2FnZUNvbGxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLDJDQUF3QztBQUN4QyxpREFBc0Q7QUFvQnREOzs7R0FHRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEscUJBQThDO0lBRWxGOzs7OztPQUtHO0lBQ0gsWUFBbUIsT0FBeUMsRUFBRSxPQUFnQztRQUM1RixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO1FBQzlILE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxHQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFFOUQsS0FBSyxDQUFDLElBQUkseUJBQWUsQ0FBQyxPQUFPLEVBQUU7WUFDakMsS0FBSztZQUNMLElBQUk7WUFDSixNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ2xFLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUVGO0FBbkJELDRDQW1CQyJ9