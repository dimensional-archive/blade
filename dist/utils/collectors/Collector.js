"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _iterator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const Storage_1 = require("../Storage");
/**
 * The base structure collector for asynchronously collecting values.
 * @since 0.0.1
 */
class Collector {
    /**
     * Creates a new Collector.
     * @param iterator The EventIterator that is yielding values.
     * @since 1.0.0
     */
    constructor(iterator) {
        /**
         * The collected values.
         * @since 0.0.1
         */
        this.collected = new Storage_1.Storage();
        /**
         * The event iterator that's yielding values.
         * @since 0.0.1
         */
        _iterator.set(this, void 0);
        __classPrivateFieldSet(this, _iterator, iterator);
    }
    /**
     * Collect's the values into the Collector's cache.
     * @since 1.0.0
     */
    async collect() {
        for await (const [struct] of __classPrivateFieldGet(this, _iterator))
            this.collected.set(struct.id, struct);
        return this.collected;
    }
}
exports.Collector = Collector;
_iterator = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbGxlY3RvcnMvQ29sbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsd0NBQXFDO0FBR3JDOzs7R0FHRztBQUNILE1BQWEsU0FBUztJQWNwQjs7OztPQUlHO0lBQ0gsWUFBbUIsUUFBVztRQWpCOUI7OztXQUdHO1FBQ08sY0FBUyxHQUFHLElBQUksaUJBQU8sRUFBYSxDQUFDO1FBRS9DOzs7V0FHRztRQUNILDRCQUFzQjtRQVFwQix1QkFBQSxJQUFJLGFBQWEsUUFBUSxFQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsT0FBTztRQUNsQixJQUFJLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkYsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQS9CRCw4QkErQkMifQ==