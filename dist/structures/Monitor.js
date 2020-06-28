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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL01vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBZ0Q7QUFDaEQsOENBQThEO0FBSzlELE1BQWEsT0FBUSxTQUFRLFdBQUk7SUFPL0I7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBb0I7UUFDdEMsT0FBTyxXQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQWdCO1FBQy9CLE1BQU0sSUFBSSxrQ0FBeUIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQWdCO1FBQ3pCLElBQUk7WUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZDO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztDQUNGO0FBakNELDBCQWlDQyJ9