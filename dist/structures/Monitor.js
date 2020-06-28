"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./base/Component");
const errors_1 = require("@ayanaware/errors");
class Monitor extends Component_1.Part {
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options) {
        return Component_1.Part.Setup(options);
    }
    /**
     * Runs this monitor
     * @param message
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL01vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBcUQ7QUFDckQsOENBQThEO0FBSzlELE1BQWEsT0FBUSxTQUFRLGdCQUFJO0lBTy9COzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQW9CO1FBQ3RDLE9BQU8sZ0JBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBZ0I7UUFDL0IsTUFBTSxJQUFJLGtDQUF5QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBZ0I7UUFDekIsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdkM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDO0NBQ0Y7QUFqQ0QsMEJBaUNDIn0=