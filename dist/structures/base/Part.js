"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@ayanaware/logger");
const path_1 = require("path");
/**
 * An abstracted base class for all parts like Command and Subscriber.
 * @since 1.0.0
 * @abstract
 */
class Part {
    constructor(store, directory, file, options = {}) {
        var _a, _b;
        options = Object.assign(options, Part._defaults);
        this.file = file;
        this.directory = directory;
        this.name = (_a = options.name) !== null && _a !== void 0 ? _a : file[file.length - 1].slice(0, -3);
        this.disabled = (_b = options.disabled) !== null && _b !== void 0 ? _b : false;
        this.fullCategory = file.slice(0, -1);
        this.client = store.client;
        this.store = store;
        this.logger = logger_1.Logger.custom(this.name, "@kyu/blade", () => `${store.name}.${this.category}.`);
    }
    static set defaults(defaults) {
        this._defaults = defaults;
    }
    /**
     * The full path of this part
     * @since 1.0.0
     */
    get path() {
        return path_1.join(this.directory, ...this.file);
    }
    /**
     * The category of this part.
     * @since 1.0.0
     */
    get category() {
        var _a;
        return (_a = this.fullCategory[0]) !== null && _a !== void 0 ? _a : "General";
    }
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating the part
     * @constructor
     */
    static Setup(options = {}) {
        return function (t) {
            return class extends t {
                constructor(...args) {
                    super(...args, options);
                }
            };
        };
    }
    /**
     * Called once the bot is ready.
     */
    init(...args) {
        args;
        return;
    }
    /**
     * Reloads this piece.
     * @since 1.0.0
     */
    async reload() {
        const part = await this.store.load(this.directory, this.file);
        await part.init(this.client);
        if (this.store.emit("compReloaded"))
            this.store.emit('compReloaded', part);
        return part;
    }
    /**
     * Remove this piece from the store.
     * @since 1.0.0
     */
    unload() {
        if (this.store.handlerCount('compUnloaded'))
            this.store.emit('compUnloaded', this);
        return this.store.remove(this);
    }
    /**
     * Disables this part.
     * @since 1.0.0
     */
    disable() {
        this.store.emit("compDisabled", this);
        this.disabled = true;
        return this;
    }
    /**
     * Enables this part.
     * @since 1.0.0
     */
    enable() {
        this.store.emit("compEnabled", this);
        this.disabled = false;
        return this;
    }
}
exports.Part = Part;
Part._defaults = {
    disabled: false,
    category: "General"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL2Jhc2UvUGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEyQztBQUMzQywrQkFBNEI7QUFXNUI7Ozs7R0FJRztBQUNILE1BQXNCLElBQUk7SUEyQ3hCLFlBQXNCLEtBQWtCLEVBQUUsU0FBaUIsRUFBRSxJQUFjLEVBQUUsVUFBdUIsRUFBRTs7UUFDcEcsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxTQUFHLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxTQUFHLE9BQU8sQ0FBQyxRQUFRLG1DQUFJLEtBQUssQ0FBQztRQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7SUFDL0YsQ0FBQztJQU9NLE1BQU0sS0FBSyxRQUFRLENBQUMsUUFBcUI7UUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsSUFBSTtRQUNiLE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsUUFBUTs7UUFDakIsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxTQUFTLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQXVCLEVBQUU7UUFDM0MsT0FBTyxVQUFrRCxDQUFJO1lBQzNELE9BQU8sS0FBTSxTQUFRLENBQUM7Z0JBQ3BCLFlBQVksR0FBRyxJQUFXO29CQUN4QixLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzFCLENBQUM7YUFDRixDQUFBO1FBQ0gsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLEdBQUcsSUFBVztRQUN4QixJQUFJLENBQUM7UUFDTCxPQUFPO0lBQ1QsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxNQUFNO1FBQ2pCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFHRDs7O09BR0c7SUFDSSxNQUFNO1FBQ1gsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkYsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksT0FBTztRQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7QUFoSkgsb0JBaUpDO0FBeEZnQixjQUFTLEdBQWdCO0lBQ3RDLFFBQVEsRUFBRSxLQUFLO0lBQ2YsUUFBUSxFQUFFLFNBQVM7Q0FDcEIsQ0FBQSJ9