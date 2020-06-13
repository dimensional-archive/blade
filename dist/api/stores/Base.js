"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentStore = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUErQztBQUMvQywrQkFBMkM7QUFDM0MseURBQXNEO0FBQ3RELDJDQUF3QztBQUN4Qyw2Q0FBaUU7QUFDakUsaURBQThDO0FBaUI5Qzs7O0dBR0c7QUFDSCxNQUFzQixjQUFvQyxTQUFRLHlCQUFXO0lBbUQzRTs7Ozs7O09BTUc7SUFDSCxZQUFzQixNQUFtQixFQUFFLElBQVksRUFBRSxVQUFpQyxFQUFFOztRQUMxRixLQUFLLEVBQUUsQ0FBQztRQTdDVjs7O1dBR0c7UUFDYSxlQUFVLEdBQXVCLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBMEM3RCxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLFNBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLGFBQWEsU0FBRyxPQUFPLENBQUMsYUFBYSxtQ0FBSSxnQkFBUyxDQUFDO1FBQ3hELElBQUksQ0FBQyxVQUFVLFNBQUcsT0FBTyxDQUFDLFVBQVUsbUNBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsZUFBZSxTQUFHLE9BQU8sQ0FBQyxlQUFlLG1DQUFJLElBQUksQ0FBQztRQUN2RCxJQUFJLENBQUMsU0FBUyxTQUFHLE9BQU8sQ0FBQyxTQUFTLG1DQUFJLFdBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4RSxJ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