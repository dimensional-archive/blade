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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbGxlY3RvcnMvQ29sbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSx3Q0FBcUM7QUFHckM7OztHQUdHO0FBQ0gsTUFBYSxTQUFTO0lBY3BCOzs7O09BSUc7SUFDSCxZQUFtQixRQUFXO1FBakI5Qjs7O1dBR0c7UUFDTyxjQUFTLEdBQUcsSUFBSSxpQkFBTyxFQUFhLENBQUM7UUFFL0M7OztXQUdHO1FBQ0gsNEJBQXNCO1FBUXBCLHVCQUFBLElBQUksYUFBYSxRQUFRLEVBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLElBQUksS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBL0JELDhCQStCQyJ9