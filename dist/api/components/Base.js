"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQTRCO0FBSTVCLDhDQUEyQztBQVEzQzs7OztHQUlHO0FBQ0gsTUFBc0IsU0FBUztJQTJDN0IsWUFBc0IsS0FBZ0MsRUFBRSxTQUFpQixFQUFFLElBQWMsRUFBRSxVQUE0QixFQUFFOztRQUN2SCxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLFNBQUcsT0FBTyxDQUFDLElBQUksbUNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxRQUFRLFNBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQUksS0FBSyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQTtJQUMvRixDQUFDO0lBT00sTUFBTSxLQUFLLFFBQVEsQ0FBQyxRQUEwQjtRQUNuRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxJQUFJO1FBQ2IsT0FBTyxXQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxRQUFROztRQUNqQixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLG1DQUFJLFNBQVMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBNEIsRUFBRTtRQUNoRCxPQUFPLFVBQXVELENBQUk7WUFDaEUsT0FBTyxLQUFNLFNBQVEsQ0FBQztnQkFDcEIsWUFBWSxHQUFHLElBQVc7b0JBQ3hCLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUIsQ0FBQzthQUNGLENBQUE7UUFDSCxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsTUFBbUI7UUFDN0IsT0FBTztJQUNULENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsTUFBTTtRQUNqQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDaEYsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUdEOzs7T0FHRztJQUNJLE1BQU07UUFDWCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztZQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxPQUFPO1FBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsb0RBQW9EO1FBQ3BELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxNQUFNO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7QUE5SUgsOEJBK0lDO0FBdEZnQixtQkFBUyxHQUFxQjtJQUMzQyxRQUFRLEVBQUUsS0FBSztJQUNmLFFBQVEsRUFBRSxTQUFTO0NBQ3BCLENBQUEifQ==