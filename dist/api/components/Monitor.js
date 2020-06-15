"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const errors_1 = require("@ayanaware/errors");
class Monitor extends Base_1.Component {
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options) {
        return Base_1.Component.Setup(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9Nb25pdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXFEO0FBQ3JELDhDQUE4RDtBQUs5RCxNQUFhLE9BQVEsU0FBUSxnQkFBUztJQU9wQzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUF5QjtRQUMzQyxPQUFPLGdCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQWdCO1FBQy9CLE1BQU0sSUFBSSxrQ0FBeUIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQWdCO1FBQ3pCLElBQUk7WUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZDO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztDQUNGO0FBakNELDBCQWlDQyJ9