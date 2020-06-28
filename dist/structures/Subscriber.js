"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Part_1 = require("./base/Part");
const errors_1 = require("@ayanaware/errors");
/**
 * An abstract class for adding a listener to an emitter.
 * @since 1.0.0
 * @extends Part
 */
class Subscriber extends Part_1.Part {
    constructor(store, dir, file, options) {
        var _a, _b, _c;
        super(store, dir, file, options);
        /**
         * Map of events.
         * @since 1.0.0
         * @private
         */
        this._listeners = {};
        const emitter = (_a = options.emitter) !== null && _a !== void 0 ? _a : "client";
        this.event = options.event;
        this.emitter = typeof emitter === "string" ? store.emitters[emitter] : emitter;
        this.mappings = (_b = options.mappings) !== null && _b !== void 0 ? _b : {};
        this.mode = (_c = options.mode) !== null && _c !== void 0 ? _c : "on";
    }
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options) {
        return Part_1.Part.Setup(options);
    }
    run(...args) {
        throw new errors_1.MethodNotImplementedError();
    }
    /**
     * Attaches the proper listener to the emitter
     * @since 1.0.0
     * @private
     */
    _listen() {
        if (Array.isArray(this.event)) {
            this.event.forEach((event) => {
                var _a;
                if (this.mappings) {
                    const mapping = this.mappings[event];
                    if (mapping) {
                        if (typeof mapping === "object") {
                            const fn = this.getFunction(mapping.fn), mode = (_a = mapping.mode) !== null && _a !== void 0 ? _a : this.mode;
                            mapping.emitter
                                ? this.getEmitter(mapping.emitter)[mode](event, (this._listeners[event] = fn))
                                : this.emitter[mode](event, (this._listeners[event] = fn));
                        }
                        const fn = this.getFunction(mapping);
                        this._listeners[event] = fn;
                        return this.emitter[this.mode](event, fn);
                    }
                    const fn = this[`on${event.slice(0, 1).toUpperCase() + event.substring(1).toLowerCase()}`].bind(this);
                    this._listeners[event] = fn;
                    return this.emitter[this.mode](event, fn);
                }
            });
        }
        else {
            this.emitter[this.mode](this.event, this.run.bind(this));
        }
    }
    /**
     * Removes the listener from the emitter
     * @since 0.0.0-alpha
     * @private
     */
    _unListen() {
        if (Array.isArray(this.event)) {
            this.event.forEach((event) => {
                if (this.mappings) {
                    const mapping = this.mappings[event];
                    if (mapping && typeof mapping === "object") {
                        return mapping.emitter
                            ? this.getEmitter(mapping.emitter).removeListener(event, this._listeners[event])
                            : this.emitter.removeListener(event, this._listeners[event]);
                    }
                    return this.emitter.removeListener(event, this._listeners[event]);
                }
            });
        }
        else {
            this.emitter.removeListener(this.event, this.run.bind(this));
        }
    }
    getEmitter(v) {
        return typeof v === "string" ? this.store.emitters[v] : v;
    }
    getFunction(v) {
        return (typeof v !== "string" ? v : this[v]).bind(this);
    }
}
exports.Subscriber = Subscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL1N1YnNjcmliZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBZ0Q7QUFDaEQsOENBQThEO0FBb0M5RDs7OztHQUlHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsV0FBSTtJQWlDbEMsWUFBbUIsS0FBc0IsRUFBRSxHQUFXLEVBQUUsSUFBYyxFQUFFLE9BQTBCOztRQUNoRyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFUbkM7Ozs7V0FJRztRQUNLLGVBQVUsR0FBNEMsRUFBRSxDQUFDO1FBTS9ELE1BQU0sT0FBTyxTQUFHLE9BQU8sQ0FBQyxPQUFPLG1DQUFJLFFBQVEsQ0FBQztRQUU1QyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMvRSxJQUFJLENBQUMsUUFBUSxTQUFHLE9BQU8sQ0FBQyxRQUFRLG1DQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxTQUFHLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBMEI7UUFDNUMsT0FBTyxXQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFHTSxHQUFHLENBQUMsR0FBRyxJQUFXO1FBQ3ZCLE1BQU0sSUFBSSxrQ0FBeUIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksT0FBTztRQUNaLElBQUksS0FBSyxDQUFDLE9BQU8s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