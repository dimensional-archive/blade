"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Monitor_1 = require("./Monitor");
const Store_1 = require("./base/Store");
const events_1 = require("events");
/**
 * A monitor store that handles loading of monitors.
 */
class MonitorStore extends Store_1.Store {
    /**
     * Creates a new Monitor Store
     * @param client The client that is using this command store.
     * @param options The options to give.
     */
    constructor(client, options = {}) {
        super(client, "monitors", {
            ...options,
            classToHandle: Monitor_1.Monitor
        });
        this.emitter = new events_1.EventEmitter();
        this.client.on("messageCreate", (m) => this.emitter.emit("message", m));
    }
    /**
     * A wrapper for the super.remove method.
     * @param resolvable
     * @since 1.0.0
     */
    remove(resolvable) {
        const monitor = super.remove(resolvable);
        if (!monitor)
            return null;
        this.emitter.removeListener("message", monitor._ran.bind(monitor));
        return monitor;
    }
    /**
     * A wrapper for the super.add method.
     * @param part
     * @since 1.0.0
     */
    add(part) {
        const monitor = super.add(part);
        if (!monitor)
            return null;
        this.emitter.on("message", part._ran.bind(part));
        return monitor;
    }
}
exports.MonitorStore = MonitorStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvclN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTW9uaXRvclN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW9DO0FBQ3BDLHdDQUF3RTtBQUd4RSxtQ0FBc0M7QUFFdEM7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxhQUFjO0lBTzlDOzs7O09BSUc7SUFDSCxZQUFtQixNQUFtQixFQUFFLFVBQXdCLEVBQUU7UUFDaEUsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7WUFDeEIsR0FBRyxPQUFPO1lBQ1YsYUFBYSxFQUFFLGlCQUFPO1NBQ3ZCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxVQUF3QztRQUNwRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkUsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxHQUFHLENBQUMsSUFBYTtRQUN0QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBN0NELG9DQTZDQyJ9