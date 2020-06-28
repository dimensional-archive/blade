"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Part_1 = require("./base/Part");
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
    run(...args) {
        return false;
    }
}
exports.Inhibitor = Inhibitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvSW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdEO0FBdUJoRDs7O0dBR0c7QUFDSCxNQUFhLFNBQVUsU0FBUSxXQUFJO0lBaUJqQzs7Ozs7O09BTUc7SUFDSCxZQUFtQixLQUFxQixFQUFFLEdBQVcsRUFBRSxJQUFjLEVBQUUsVUFBNEIsRUFBRTs7UUFDbkcsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxJQUFJLFNBQUcsT0FBTyxDQUFDLElBQUksbUNBQUksS0FBSyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLFNBQUcsT0FBTyxDQUFDLE1BQU0sbUNBQUksSUFBSSxDQUFDLElBQUksQ0FBQztRQUMxQyxJQUFJLENBQUMsUUFBUSxTQUFHLE9BQU8sQ0FBQyxRQUFRLG1DQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQUcsSUFBVztRQUN2QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRjtBQW5DRCw4QkFtQ0MifQ==