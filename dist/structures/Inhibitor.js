"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Part_1 = require("./base/Part");
const errors_1 = require("@ayanaware/errors");
/**
 * A message inhibitor.
 * @since 1.0.0
 */
class Inhibitor extends Part_1.Part {
    /**
     * Creates a new Inhibitor.
     * @param store The store this inhibitor belongs to
     * @param dir The directory this inhibitor is in.
     * @param path The file path this inhibitor.
     * @param options The options to give this inhibitor.
     */
    constructor(store, dir, path, options = {}) {
        var _a, _b, _c;
        super(store, dir, path, options);
        this.type = (_a = options.type) !== null && _a !== void 0 ? _a : "pre";
        this.reason = (_b = options.reason) !== null && _b !== void 0 ? _b : this.name;
        this.priority = (_c = options.priority) !== null && _c !== void 0 ? _c : 0;
    }
    /**
     * Runs this command.
     * @param message
     * @param command
     * @since 1.0.0
     */
    async run(message, command) {
        throw new errors_1.MethodNotImplementedError();
    }
}
exports.Inhibitor = Inhibitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvSW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdEO0FBQ2hELDhDQUE4RDtBQXlCOUQ7OztHQUdHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsV0FBSTtJQWlCakM7Ozs7OztPQU1HO0lBQ0gsWUFBbUIsS0FBcUIsRUFBRSxHQUFXLEVBQUUsSUFBYyxFQUFFLFVBQTRCLEVBQUU7O1FBQ25HLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsSUFBSSxTQUFHLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxTQUFHLE9BQU8sQ0FBQyxNQUFNLG1DQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFnQixFQUFFLE9BQWlCO1FBQ2xELE1BQU0sSUFBSSxrQ0FBeUIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQXpDRCw4QkF5Q0MifQ==