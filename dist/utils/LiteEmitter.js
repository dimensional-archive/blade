"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteEmitter = exports.LiteEmitterError = void 0;
const errors_1 = require("@ayanaware/errors");
/**
 * An error that's created whenever a handler has throw an error.
 */
class LiteEmitterError extends errors_1.GenericError {
}
exports.LiteEmitterError = LiteEmitterError;
/**
 * A simplified EventEmitter.
 * @since 1.0.0
 */
class LiteEmitter {
    constructor() {
        this._handlers = new Map();
    }
    /**
     * The amount of handlers for a given event.
     * @param event The event to get.
     * @since 1.0.0
     */
    handlerCount(event) {
        if (!this._handlers.has(event))
            return 0;
        return this._handlers.get(event).size;
    }
    /**
     * Add a handler function for a given event.
     * @param event The name of the event.
     * @param fn The handler function.
     */
    addListener(event, fn) {
        if (!this._handlers.has(event))
            this._handlers.set(event, new Set());
        const handlers = this._handlers.get(event);
        handlers.add(fn);
        return this;
    }
    /**
     * Remove one or all handler functions for a given event.
     * @param event The name of the event.
     * @param fn Optional handler to detach.
     */
    removeListener(event, fn) {
        const handlers = this._handlers.get(event);
        if (!handlers)
            return this;
        if (fn && handlers.has(fn)) {
            handlers.delete(fn);
            if (handlers.size === 0)
                this._handlers.delete(event);
        }
        else {
            this._handlers.delete(event);
        }
        return this;
    }
    /**
     * Add a handler function for a given event.
     * @param event The name of the event.
     * @param callback
     */
    on(event, callback) {
        this.addListener(event, callback);
        return this;
    }
    /**
     * Add a handler function for a given event.
     * @param event The name of the event.
     * @param callback
     */
    once(event, callback) {
        const once = (...args) => {
            try {
                callback(...args);
            }
            catch (e) {
                if (event === "error")
                    throw new LiteEmitterError(`Caught Error in "error" handler function`).setCause(e);
                this.emit('error', new LiteEmitterError(`Caught Error in handler function`).setCause(e));
            }
            finally {
                this.removeListener(event, once);
            }
        };
        this.addListener(event, once);
        return this;
    }
    /**
     * Emit a new event to handlers.
     * @param event The name of the event.
     * @param args Event arguments.
     */
    emit(event, ...args) {
        const handlers = this._handlers.get(event);
        if (!handlers)
            return this;
        for (const handler of handlers) {
            try {
                handler(...args);
            }
            catch (e) {
                if (event === "error")
                    throw new LiteEmitterError(`Caught Error in "error" handler function`).setCause(e);
                this.emit('error', new LiteEmitterError(`Caught Error in handler function`).setCause(e));
            }
        }
        return this;
    }
}
exports.LiteEmitter = LiteEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl0ZUVtaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvTGl0ZUVtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQWlEO0FBS2pEOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxxQkFBWTtDQUNqRDtBQURELDRDQUNDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBYSxXQUFXO0lBQXhCO1FBQ21CLGNBQVMsR0FBeUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQWtHL0UsQ0FBQztJQWhHQzs7OztPQUlHO0lBQ0ksWUFBWSxDQUFDLEtBQWE7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUMsSUFBSSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksV0FBVyxDQUFDLEtBQWEsRUFBRSxFQUFzQjtRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztRQUVyRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQztRQUM1QyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxjQUFjLENBQUMsS0FBYSxFQUFFLEVBQXVCO1FBQzFELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFM0IsSUFBSSxFQUFFLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMxQixRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDO2dCQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxFQUFFLENBQUMsS0FBYSxFQUFFLFFBQTRCO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWxDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsS0FBYSxFQUFFLFFBQTRCO1FBQ3JELE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRTtZQUM5QixJQUFJO2dCQUNGLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ25CO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxLQUFLLEtBQUssT0FBTztvQkFBRSxNQUFNLElBQUksZ0JBQWdCLENBQUMsMENBQTBDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksZ0JBQWdCLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxRjtvQkFBUztnQkFDUixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNsQztRQUNILENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsS0FBYSxFQUFFLEdBQUcsSUFBZ0I7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUzQixLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUM5QixJQUFJO2dCQUNGLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsSUFBSSxLQUFLLEtBQUssT0FBTztvQkFBRSxNQUFNLElBQUksZ0JBQWdCLENBQUMsMENBQTBDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksZ0JBQWdCLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxRjtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFuR0Qsa0NBbUdDIn0=