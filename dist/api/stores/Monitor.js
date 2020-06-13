"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorStore = void 0;
const Monitor_1 = require("../components/Monitor");
const Base_1 = require("./Base");
const __1 = require("../..");
/**
 * A monitor store that handles loading of monitors.
 */
class MonitorStore extends Base_1.ComponentStore {
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
        this.emitter = new __1.LiteEmitter();
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
     * @param component
     * @since 1.0.0
     */
    add(component) {
        const monitor = super.add(component);
        if (!monitor)
            return null;
        this.emitter.on("message", component._ran.bind(component));
        return monitor;
    }
}
exports.MonitorStore = MonitorStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL01vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQWdEO0FBQ2hELGlDQUFvRjtBQUNwRiw2QkFBb0M7QUFJcEM7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxxQkFBdUI7SUFPdkQ7Ozs7T0FJRztJQUNILFlBQW1CLE1BQW1CLEVBQUUsVUFBaUMsRUFBRTtRQUN6RSxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtZQUN4QixHQUFHLE9BQU87WUFDVixhQUFhLEVBQUUsaUJBQU87U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGVBQVcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBd0M7UUFDcEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksR0FBRyxDQUFDLFNBQWtCO1FBQzNCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0Y7QUE3Q0Qsb0NBNkNDIn0=