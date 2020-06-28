"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subscriber_1 = require("./Subscriber");
const Store_1 = require("./base/Store");
class SubscriberStore extends Store_1.Store {
    constructor(client, options = {}) {
        var _a;
        super(client, "events", {
            classToHandle: Subscriber_1.Subscriber,
            ...options
        });
        this.emitters = (_a = options.emitters) !== null && _a !== void 0 ? _a : {
            client,
            listeners: this
        };
    }
    /**
     * A wrapper for the super.remove method.
     * @param resolvable The listener to remove.
     */
    remove(resolvable) {
        const removed = super.remove(resolvable);
        if (!removed)
            return null;
        removed._unListen();
        return removed;
    }
    /**
     * A wrapper for the super.add method.
     * @param part The listener to add.
     */
    add(part) {
        const listener = super.add(part);
        if (!listener)
            return null;
        listener._listen();
        return listener;
    }
}
exports.SubscriberStore = SubscriberStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlclN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvU3Vic2NyaWJlclN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQW1EO0FBQ25ELHdDQUF3RTtBQVF4RSxNQUFhLGVBQWdCLFNBQVEsYUFBaUI7SUFHcEQsWUFBWSxNQUFtQixFQUFFLFVBQWtDLEVBQUU7O1FBQ25FLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO1lBQ3RCLGFBQWEsRUFBRSx1QkFBVTtZQUN6QixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxTQUFHLE9BQU8sQ0FBQyxRQUFRLG1DQUFJO1lBQ2xDLE1BQU07WUFDTixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFBO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxVQUEyQztRQUN2RCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFMUIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxHQUFHLENBQUMsSUFBZ0I7UUFDekIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTNCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0Y7QUF0Q0QsMENBc0NDIn0=