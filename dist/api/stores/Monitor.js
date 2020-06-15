"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL01vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBZ0Q7QUFDaEQsaUNBQW9GO0FBQ3BGLDZCQUFvQztBQUlwQzs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLHFCQUF1QjtJQU92RDs7OztPQUlHO0lBQ0gsWUFBbUIsTUFBbUIsRUFBRSxVQUFpQyxFQUFFO1FBQ3pFLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLEdBQUcsT0FBTztZQUNWLGFBQWEsRUFBRSxpQkFBTztTQUN2QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBVyxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxVQUF3QztRQUNwRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkUsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxHQUFHLENBQUMsU0FBa0I7UUFDM0IsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQTdDRCxvQ0E2Q0MifQ==