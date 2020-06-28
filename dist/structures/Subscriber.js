"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./base/Component");
const errors_1 = require("@ayanaware/errors");
/**
 * An abstract class for adding a listener to an emitter.
 * @since 1.0.0
 * @extends Part
 */
class Subscriber extends Component_1.Part {
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
        return Component_1.Part.Setup(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL1N1YnNjcmliZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBcUQ7QUFDckQsOENBQThEO0FBcUM5RDs7OztHQUlHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsZ0JBQUk7SUFpQ2xDLFlBQW1CLEtBQXNCLEVBQUUsR0FBVyxFQUFFLElBQWMsRUFBRSxPQUEwQjs7UUFDaEcsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBVG5DOzs7O1dBSUc7UUFDSyxlQUFVLEdBQTRDLEVBQUUsQ0FBQztRQU0vRCxNQUFNLE9BQU8sU0FBRyxPQUFPLENBQUMsT0FBTyxtQ0FBSSxRQUFRLENBQUM7UUFFNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDL0UsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksU0FBRyxPQUFPLENBQUMsSUFBSSxtQ0FBSSxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQTBCO1FBQzVDLE9BQU8sZ0JBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUdNLEdBQUcsQ0FBQyxHQUFHLElBQVc7UUFDdkIsTUFBTSxJQUFJLGtDQUF5QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxPQUFPO1FBQ1osSUFBSSxLQUFLLENBQUMsT0FB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