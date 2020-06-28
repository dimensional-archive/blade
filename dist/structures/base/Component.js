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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvYmFzZS9Db21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBMkM7QUFDM0MsK0JBQTRCO0FBVzVCOzs7O0dBSUc7QUFDSCxNQUFzQixJQUFJO0lBMkN4QixZQUFzQixLQUFrQixFQUFFLFNBQWlCLEVBQUUsSUFBYyxFQUFFLFVBQXVCLEVBQUU7O1FBQ3BHLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksU0FBRyxPQUFPLENBQUMsSUFBSSxtQ0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxLQUFLLENBQUM7UUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBO0lBQy9GLENBQUM7SUFPTSxNQUFNLEtBQUssUUFBUSxDQUFDLFFBQXFCO1FBQzlDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFXLElBQUk7UUFDYixPQUFPLFdBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFXLFFBQVE7O1FBQ2pCLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsbUNBQUksU0FBUyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUF1QixFQUFFO1FBQzNDLE9BQU8sVUFBa0QsQ0FBSTtZQUMzRCxPQUFPLEtBQU0sU0FBUSxDQUFDO2dCQUNwQixZQUFZLEdBQUcsSUFBVztvQkFDeEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQixDQUFDO2FBQ0YsQ0FBQTtRQUNILENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxHQUFHLElBQVc7UUFDeEIsSUFBSSxDQUFDO1FBQ0wsT0FBTztJQUNULENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsTUFBTTtRQUNqQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlELE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0UsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBR0Q7OztPQUdHO0lBQ0ksTUFBTTtRQUNYLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO1lBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25GLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE9BQU87UUFDWixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTTtRQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O0FBaEpILG9CQWlKQztBQXhGZ0IsY0FBUyxHQUFnQjtJQUN0QyxRQUFRLEVBQUUsS0FBSztJQUNmLFFBQVEsRUFBRSxTQUFTO0NBQ3BCLENBQUEifQ==