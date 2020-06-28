"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./base/Component");
/**
 * A message inhibitor.
 * @since 1.0.0
 */
class Inhibitor extends Component_1.Part {
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
    run(...args) {
        return false;
    }
}
exports.Inhibitor = Inhibitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvSW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQXFEO0FBdUJyRDs7O0dBR0c7QUFDSCxNQUFhLFNBQVUsU0FBUSxnQkFBSTtJQWlCakM7Ozs7OztPQU1HO0lBQ0gsWUFBbUIsS0FBcUIsRUFBRSxHQUFXLEVBQUUsSUFBYyxFQUFFLFVBQTRCLEVBQUU7O1FBQ25HLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsSUFBSSxTQUFHLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxTQUFHLE9BQU8sQ0FBQyxNQUFNLG1DQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLEdBQUcsQ0FBQyxHQUFHLElBQVc7UUFDdkIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUFuQ0QsOEJBbUNDIn0=