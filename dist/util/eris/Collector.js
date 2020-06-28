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
        this.collected = new Storage_1.Collection();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvZXJpcy9Db2xsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHdDQUF3QztBQUd4Qzs7O0dBR0c7QUFDSCxNQUFhLFNBQVM7SUFjcEI7Ozs7T0FJRztJQUNILFlBQW1CLFFBQVc7UUFqQjlCOzs7V0FHRztRQUNPLGNBQVMsR0FBRyxJQUFJLG9CQUFVLEVBQWEsQ0FBQztRQUVsRDs7O1dBR0c7UUFDSCw0QkFBc0I7UUFRcEIsdUJBQUEsSUFBSSxhQUFhLFFBQVEsRUFBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLE9BQU87UUFDbEIsSUFBSSxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25GLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUEvQkQsOEJBK0JDIn0=