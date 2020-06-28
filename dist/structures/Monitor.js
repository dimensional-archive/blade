"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Part_1 = require("./base/Part");
const errors_1 = require("@ayanaware/errors");
class Monitor extends Part_1.Part {
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options) {
        return Part_1.Part.Setup(options);
    }
    /**
     * Runs this monitor.
     * @param message
     * @param command
     * @since 1.0.0
     */
    async run(message) {
        throw new errors_1.MethodNotImplementedError();
    }
    async _ran(message) {
        try {
            this.store.emit("started", this, message);
            await this.run(message);
            this.store.emit("ran", this, message);
        }
        catch (e) {
            this.store.emit("error", this, e);
        }
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL01vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBZ0Q7QUFDaEQsOENBQThEO0FBSzlELE1BQWEsT0FBUSxTQUFRLFdBQUk7SUFPL0I7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBb0I7UUFDdEMsT0FBTyxXQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBZ0I7UUFDL0IsTUFBTSxJQUFJLGtDQUF5QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBZ0I7UUFDekIsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdkM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDO0NBQ0Y7QUFuQ0QsMEJBbUNDIn0=