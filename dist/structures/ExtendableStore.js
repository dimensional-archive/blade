"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("./base/Store");
const Extendable_1 = require("./Extendable");
class ExtendableStore extends Store_1.Store {
    constructor(client, options = {}) {
        super(client, "extendables", {
            classToHandle: Extendable_1.Extendable,
            ...options,
        });
    }
    /**
       * Removes an extendable from the store.
     * @param extendable The extendable to remove
       * @since 1.0.6
       */
    remove(extendable) {
        const exte = super.remove(extendable);
        if (!exte)
            return null;
        exte.disable();
        return exte;
    }
    /**
     * Adds an extendable to this store.
     * @param extendable The extendable to add.
     * @since 1.0.6
     */
    add(extendable) {
        const exte = super.add(extendable);
        if (!exte)
            return null;
        exte.init();
        return exte;
    }
}
exports.ExtendableStore = ExtendableStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXh0ZW5kYWJsZVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvRXh0ZW5kYWJsZVN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdFO0FBR3hFLDZDQUEwQztBQUUxQyxNQUFhLGVBQWdCLFNBQVEsYUFBaUI7SUFDcEQsWUFBWSxNQUFtQixFQUFFLFVBQXdCLEVBQUU7UUFDekQsS0FBSyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUU7WUFDM0IsYUFBYSxFQUFFLHVCQUFVO1lBQ3pCLEdBQUcsT0FBTztTQUNYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztTQUlFO0lBQ0ssTUFBTSxDQUFDLFVBQTJDO1FBQ3ZELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksR0FBRyxDQUFDLFVBQXNCO1FBQy9CLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQS9CRCwwQ0ErQkMifQ==