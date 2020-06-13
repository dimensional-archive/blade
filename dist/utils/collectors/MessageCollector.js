"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCollector = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZUNvbGxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9jb2xsZWN0b3JzL01lc3NhZ2VDb2xsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsMkNBQXdDO0FBQ3hDLGlEQUFzRDtBQW9CdEQ7OztHQUdHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxxQkFBOEM7SUFFbEY7Ozs7O09BS0c7SUFDSCxZQUFtQixPQUF5QyxFQUFFLE9BQWdDO1FBQzVGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7UUFDOUgsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLEdBQVksRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUU5RCxLQUFLLENBQUMsSUFBSSx5QkFBZSxDQUFDLE9BQU8sRUFBRTtZQUNqQyxLQUFLO1lBQ0wsSUFBSTtZQUNKLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDbEUsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0NBRUY7QUFuQkQsNENBbUJDIn0=