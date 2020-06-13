"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitor = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9Nb25pdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFxRDtBQUNyRCw4Q0FBOEQ7QUFLOUQsTUFBYSxPQUFRLFNBQVEsZ0JBQVM7SUFPcEM7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBeUI7UUFDM0MsT0FBTyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFnQjtRQUMvQixNQUFNLElBQUksa0NBQXlCLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFnQjtRQUN6QixJQUFJO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN2QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7Q0FDRjtBQWpDRCwwQkFpQ0MifQ==