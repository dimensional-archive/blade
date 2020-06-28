"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Monitor_1 = require("./Monitor");
const Store_1 = require("./base/Store");
const __1 = require("..");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvclN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTW9uaXRvclN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW9DO0FBQ3BDLHdDQUF3RTtBQUN4RSwwQkFBaUM7QUFJakM7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxhQUFjO0lBTzlDOzs7O09BSUc7SUFDSCxZQUFtQixNQUFtQixFQUFFLFVBQXdCLEVBQUU7UUFDaEUsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7WUFDeEIsR0FBRyxPQUFPO1lBQ1YsYUFBYSxFQUFFLGlCQUFPO1NBQ3ZCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFXLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFVBQXdDO1FBQ3BELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuRSxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEdBQUcsQ0FBQyxJQUFhO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0Y7QUE3Q0Qsb0NBNkNDIn0=