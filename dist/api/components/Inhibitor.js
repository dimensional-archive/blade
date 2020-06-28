"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
/**
 * A message inhibitor.
 * @since 1.0.0
 */
class Inhibitor extends Base_1.Component {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb21wb25lbnRzL0luaGliaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFxRDtBQXVCckQ7OztHQUdHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZ0JBQVM7SUFpQnRDOzs7Ozs7T0FNRztJQUNILFlBQW1CLEtBQXFCLEVBQUUsR0FBVyxFQUFFLElBQWMsRUFBRSxVQUE0QixFQUFFOztRQUNuRyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLElBQUksU0FBRyxPQUFPLENBQUMsSUFBSSxtQ0FBSSxLQUFLLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sU0FBRyxPQUFPLENBQUMsTUFBTSxtQ0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLFNBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxHQUFHLENBQUMsR0FBRyxJQUFXO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBbkNELDhCQW1DQyJ9