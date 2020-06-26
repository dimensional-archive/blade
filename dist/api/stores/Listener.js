"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listener_1 = require("../components/Listener");
const Base_1 = require("./Base");
class ListenerStore extends Base_1.ComponentStore {
    constructor(client, options = {}) {
        var _a;
        super(client, "events", {
            classToHandle: Listener_1.Listener,
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
     * @param component The listener to add.
     */
    add(component) {
        const listener = super.add(component);
        if (!listener)
            return null;
        listener._listen();
        return listener;
    }
}
exports.ListenerStore = ListenerStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3N0b3Jlcy9MaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUEyRDtBQUMzRCxpQ0FBb0Y7QUFRcEYsTUFBYSxhQUFjLFNBQVEscUJBQXdCO0lBR3pELFlBQVksTUFBbUIsRUFBRSxVQUFnQyxFQUFFOztRQUNqRSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtZQUN0QixhQUFhLEVBQUUsbUJBQVE7WUFDdkIsR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSTtZQUNsQyxNQUFNO1lBQ04sU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQTtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsVUFBeUM7UUFDckQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTFCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNwQixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksR0FBRyxDQUFDLFNBQW1CO1FBQzVCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUzQixRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBdENELHNDQXNDQyJ9