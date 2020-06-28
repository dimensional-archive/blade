"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl0ZUVtaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9MaXRlRW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUFpRDtBQUtqRDs7R0FFRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEscUJBQVk7Q0FDakQ7QUFERCw0Q0FDQztBQUVEOzs7R0FHRztBQUNILE1BQWEsV0FBVztJQUF4QjtRQUNtQixjQUFTLEdBQXlDLElBQUksR0FBRyxFQUFFLENBQUM7SUFrRy9FLENBQUM7SUFoR0M7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxLQUFhO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxLQUFhLEVBQUUsRUFBc0I7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFckUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUM7UUFDNUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVqQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksY0FBYyxDQUFDLEtBQWEsRUFBRSxFQUF1QjtRQUMxRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTNCLElBQUksRUFBRSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDMUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksRUFBRSxDQUFDLEtBQWEsRUFBRSxRQUE0QjtRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksSUFBSSxDQUFDLEtBQWEsRUFBRSxRQUE0QjtRQUNyRCxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUU7WUFDOUIsSUFBSTtnQkFDRixRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUNuQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLElBQUksS0FBSyxLQUFLLE9BQU87b0JBQUUsTUFBTSxJQUFJLGdCQUFnQixDQUFDLDBDQUEwQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLGdCQUFnQixDQUFDLGtDQUFrQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUY7b0JBQVM7Z0JBQ1IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDbEM7UUFDSCxDQUFDLENBQUE7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU5QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksSUFBSSxDQUFDLEtBQWEsRUFBRSxHQUFHLElBQWdCO1FBQzVDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFM0IsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFDOUIsSUFBSTtnQkFDRixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUNsQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLElBQUksS0FBSyxLQUFLLE9BQU87b0JBQUUsTUFBTSxJQUFJLGdCQUFnQixDQUFDLDBDQUEwQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLGdCQUFnQixDQUFDLGtDQUFrQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUY7U0FDRjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBbkdELGtDQW1HQyJ9