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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl0ZUVtaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvTGl0ZUVtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBaUQ7QUFLakQ7O0dBRUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHFCQUFZO0NBQ2pEO0FBREQsNENBQ0M7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLFdBQVc7SUFBeEI7UUFDbUIsY0FBUyxHQUF5QyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBa0cvRSxDQUFDO0lBaEdDOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsS0FBYTtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsS0FBYSxFQUFFLEVBQXNCO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBQzVDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGNBQWMsQ0FBQyxLQUFhLEVBQUUsRUFBdUI7UUFDMUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUzQixJQUFJLEVBQUUsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzFCLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUM7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkQ7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEVBQUUsQ0FBQyxLQUFhLEVBQUUsUUFBNEI7UUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFbEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLElBQUksQ0FBQyxLQUFhLEVBQUUsUUFBNEI7UUFDckQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFO1lBQzlCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDbkI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixJQUFJLEtBQUssS0FBSyxPQUFPO29CQUFFLE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFGO29CQUFTO2dCQUNSLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFOUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLElBQUksQ0FBQyxLQUFhLEVBQUUsR0FBRyxJQUFnQjtRQUM1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTNCLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO1lBQzlCLElBQUk7Z0JBQ0YsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDbEI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixJQUFJLEtBQUssS0FBSyxPQUFPO29CQUFFLE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFGO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQW5HRCxrQ0FtR0MifQ==