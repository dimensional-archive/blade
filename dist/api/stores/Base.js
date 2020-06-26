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
const fs_1 = require("fs");
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
        this.client.stores.set(name, this);
        this.priority = (_a = options.priority) !== null && _a !== void 0 ? _a : -1;
        this.classToHandle = (_b = options.classToHandle) !== null && _b !== void 0 ? _b : Base_1.Component;
        this.loadFilter = (_c = options.loadFilter) !== null && _c !== void 0 ? _c : (() => false);
        this.createDirectory = (_d = options.createDirectory) !== null && _d !== void 0 ? _d : true;
        this.directory = (_e = options.directory) !== null && _e !== void 0 ? _e : path_1.join(client.directory, this.name);
        if (options.defaults)
            options.classToHandle.defaults = options.defaults;
        if (client.started)
            this.loadAll();
    }
    static walkDir(store, dir) {
        let files = [];
        try {
            files = Util_1.Util.walk(dir);
        }
        catch (e) {
            if (store.createDirectory) {
                fs_1.mkdir(dir, () => {
                    files = Util_1.Util.walk(dir);
                });
            }
        }
        return files.map((file) => store.load(dir, path_1.relative(dir, file).split(path_1.sep)));
    }
    async load(directory, file) {
        const loc = path_1.join(directory, ...file);
        let comp;
        try {
            const loaded = await Promise.resolve().then(() => __importStar(require(loc)));
            const loadedComp = "default" in loaded ? loaded.default : loaded;
            if (!Util_1.Util.isClass(loadedComp))
                throw new errors_1.ParseError("The exported structure is not a class.");
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
    createDirectory: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsOENBQStDO0FBQy9DLCtCQUEyQztBQUMzQyx5REFBc0Q7QUFDdEQsMkNBQXdDO0FBQ3hDLDZDQUFpRTtBQUNqRSxpREFBOEM7QUFHOUMsMkJBQTJCO0FBZTNCOzs7R0FHRztBQUNILE1BQXNCLGNBQW9DLFNBQVEseUJBQVc7SUFtRDNFOzs7Ozs7T0FNRztJQUNILFlBQ0UsTUFBbUIsRUFDbkIsSUFBWSxFQUNaLFVBQWlDLEVBQUU7O1FBRW5DLEtBQUssRUFBRSxDQUFDO1FBakRWOzs7V0FHRztRQUNhLGVBQVUsR0FBdUIsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUE4QzdELE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsUUFBUSxTQUFHLE9BQU8sQ0FBQyxRQUFRLG1DQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLFNBQUcsT0FBTyxDQUFDLGFBQWEsbUNBQUksZ0JBQVMsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxTQUFHLE9BQU8sQ0FBQyxVQUFVLG1DQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGVBQWUsU0FBRyxPQUFPLENBQUMsZUFBZSxtQ0FBSSxJQUFJLENBQUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsU0FBRyxPQUFPLENBQUMsU0FB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