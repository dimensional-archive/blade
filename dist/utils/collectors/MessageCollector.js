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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZUNvbGxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9jb2xsZWN0b3JzL01lc3NhZ2VDb2xsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSwyQ0FBd0M7QUFDeEMsaURBQXNEO0FBb0J0RDs7O0dBR0c7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHFCQUE4QztJQUVsRjs7Ozs7T0FLRztJQUNILFlBQW1CLE9BQXlDLEVBQUUsT0FBZ0M7UUFDNUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUVBQXVFLENBQUMsQ0FBQztRQUM5SCxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsR0FBWSxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRTlELEtBQUssQ0FBQyxJQUFJLHlCQUFlLENBQUMsT0FBTyxFQUFFO1lBQ2pDLEtBQUs7WUFDTCxJQUFJO1lBQ0osTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBVyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNsRSxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FFRjtBQW5CRCw0Q0FtQkMifQ==