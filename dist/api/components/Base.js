"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const path_1 = require("path");
const logger_1 = require("@ayanaware/logger");
/**
 * An abstracted base class for all components like Command and Listener.
 * @since 1.0.0
 * @abstract
 */
class Component {
    constructor(store, directory, file, options = {}) {
        var _a, _b;
        options = Object.assign(options, Component._defaults);
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
     * The full path of this component
     * @since 1.0.0
     */
    get path() {
        return path_1.join(this.directory, ...this.file);
    }
    /**
     * The category of this component.
     * @since 1.0.0
     */
    get category() {
        var _a;
        return (_a = this.fullCategory[0]) !== null && _a !== void 0 ? _a : "General";
    }
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating the component
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
    init(client) {
        return;
    }
    /**
     * Reloads this piece.
     * @since 1.0.0
     */
    async reload() {
        const component = await this.store.load(this.directory, this.file);
        await component.init(this.client);
        if (this.store.emit("compReloaded"))
            this.store.emit('compReloaded', component);
        return component;
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
     * Disables this component.
     * @since 1.0.0
     */
    disable() {
        this.disabled = true;
        // TODO create disable method in the Component Store
        return this;
    }
    /**
     * Enables this component.
     * @since 1.0.0
     */
    async enable() {
        this.disabled = false;
        return this.store.load(this.directory, this.file);
    }
}
exports.Component = Component;
Component._defaults = {
    disabled: false,
    category: "General"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUE0QjtBQUk1Qiw4Q0FBMkM7QUFRM0M7Ozs7R0FJRztBQUNILE1BQXNCLFNBQVM7SUEyQzdCLFlBQXNCLEtBQWdDLEVBQUUsU0FBaUIsRUFBRSxJQUFjLEVBQUUsVUFBNEIsRUFBRTs7UUFDdkgsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV0RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxTQUFHLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxTQUFHLE9BQU8sQ0FBQyxRQUFRLG1DQUFJLEtBQUssQ0FBQztRQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7SUFDL0YsQ0FBQztJQU9NLE1BQU0sS0FBSyxRQUFRLENBQUMsUUFBMEI7UUFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsSUFBSTtRQUNiLE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsUUFBUTs7UUFDakIsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxTQUFTLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQTRCLEVBQUU7UUFDaEQsT0FBTyxVQUF1RCxDQUFJO1lBQ2hFLE9BQU8sS0FBTSxTQUFRLENBQUM7Z0JBQ3BCLFlBQVksR0FBRyxJQUFXO29CQUN4QixLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzFCLENBQUM7YUFDRixDQUFBO1FBQ0gsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLE1BQW1CO1FBQzdCLE9BQU87SUFDVCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLE1BQU07UUFDakIsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxNQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hGLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFHRDs7O09BR0c7SUFDSSxNQUFNO1FBQ1gsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkYsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksT0FBTztRQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLG9EQUFvRDtRQUNwRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsTUFBTTtRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7O0FBOUlILDhCQStJQztBQXRGZ0IsbUJBQVMsR0FBcUI7SUFDM0MsUUFBUSxFQUFFLEtBQUs7SUFDZixRQUFRLEVBQUUsU0FBUztDQUNwQixDQUFBIn0=