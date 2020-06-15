"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@ayanaware/errors");
const path_1 = require("path");
const LiteEmitter_1 = require("../../utils/LiteEmitter");
const Util_1 = require("../../utils/Util");
const Base_1 = require("../components/Base");
const Storage_1 = require("../../utils/Storage");
/**
 * A component store.
 * @since 1.0.0
 */
class ComponentStore extends LiteEmitter_1.LiteEmitter {
    /**
     * Creates a new Component Store.
     * @param client The client that's using this store.
     * @param name The name of this store.
     * @param options The options to give this store.
     * @since 1.0.0
     */
    constructor(client, name, options = {}) {
        var _a, _b, _c, _d, _e;
        super();
        /**
         * All of the loaded components.
         * @since 1.0.0
         */
        this.components = new Storage_1.Storage();
        options = Object.assign(options, ComponentStore._defaults);
        this.client = client;
        this.name = name;
        this.priority = (_a = options.priority) !== null && _a !== void 0 ? _a : -1;
        this.classToHandle = (_b = options.classToHandle) !== null && _b !== void 0 ? _b : Base_1.Component;
        this.loadFilter = (_c = options.loadFilter) !== null && _c !== void 0 ? _c : (() => false);
        this.createDirectory = (_d = options.createDirectory) !== null && _d !== void 0 ? _d : true;
        this.directory = (_e = options.directory) !== null && _e !== void 0 ? _e : path_1.join(client.directory, this.name);
        if (options.defaults)
            options.classToHandle.defaults = options.defaults;
    }
    static walkDir(store, dir) {
        const files = Util_1.Util.walk(dir);
        return files.map(file => store.load(dir, path_1.relative(dir, file).split(path_1.sep)));
    }
    async load(directory, file) {
        const loc = path_1.join(directory, ...file);
        let comp;
        try {
            const loaded = await Promise.resolve().then(() => __importStar(require(loc)));
            const loadedComp = 'default' in loaded ? loaded.default : loaded;
            if (!Util_1.Util.isClass(loadedComp))
                throw new errors_1.ParseError('The exported structure is not a class.');
            this.add(new loadedComp(this, directory, file));
        }
        catch (e) {
            this.emit("loadError", new errors_1.ParseError(`Couldn't parse file ${file}`).setCause(e));
        }
        delete require.cache[loc];
        module.children.pop();
        return comp;
    }
    /**
     * Loads all files in the given directory.
     * @since 1.0.0
     * @returns {number} Total components loaded.
     */
    async loadAll() {
        this.components.clear();
        await ComponentStore.walkDir(this, this.directory);
        return this.components.size;
    }
    /**
     * Resolves a string or component into... a component.
     * @param resolvable
     * @returns {Component} The resolved component.
     */
    resolve(resolvable) {
        if (typeof resolvable === "string")
            return this.components.get(resolvable);
        else if (resolvable instanceof this.classToHandle)
            return resolvable;
        else
            return;
    }
    /**
     * Removes a component from the store.
     * @param resolvable The component to remove.
     * @since 1.0.0
     */
    remove(resolvable) {
        const comp = this.resolve(resolvable);
        if (comp) {
            this.emit("compRemoved", comp);
            this.components.delete(comp.name);
            return comp;
        }
        return null;
    }
    /**
     * Adds a component to the store.
     * @param component
     * @since 1.0.0
     */
    add(component) {
        if (!(component instanceof this.classToHandle)) {
            this.emit("loadError", `Only ${this} can be added into this store.`);
            return null;
        }
        this.components.delete(component.name);
        this.components.set(component.name, component);
        this.emit("loaded", component);
        return component;
    }
    /**
     * Returns the string representation of this store.
     * @since 1.0.0
     */
    toString() {
        return this.name;
    }
}
exports.ComponentStore = ComponentStore;
ComponentStore._defaults = {
    priority: -1,
    classToHandle: Base_1.Component,
    autoCategory: false,
    loadFilter: () => true,
    createDirectory: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsOENBQStDO0FBQy9DLCtCQUEyQztBQUMzQyx5REFBc0Q7QUFDdEQsMkNBQXdDO0FBQ3hDLDZDQUFpRTtBQUNqRSxpREFBOEM7QUFpQjlDOzs7R0FHRztBQUNILE1BQXNCLGNBQW9DLFNBQVEseUJBQVc7SUFtRDNFOzs7Ozs7T0FNRztJQUNILFlBQXNCLE1BQW1CLEVBQUUsSUFBWSxFQUFFLFVBQWlDLEVBQUU7O1FBQzFGLEtBQUssRUFBRSxDQUFDO1FBN0NWOzs7V0FHRztRQUNhLGVBQVUsR0FBdUIsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUEwQzdELE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsYUFBYSxTQUFHLE9BQU8sQ0FBQyxhQUFhLG1DQUFJLGdCQUFTLENBQUM7UUFDeEQsSUFBSSxDQUFDLFVBQVUsU0FBRyxPQUFPLENBQUMsVUFBVSxtQ0FBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxlQUFlLFNBQUcsT0FBTyxDQUFDLGVBQWUsbUNBQUksSUFBSSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxTQUFTLFNBQUcsT0FBTyxDQUFDLFNBQVMsbUNBQUksV0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhFLElBQUksT0FBTyxDQUFD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