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
const LiteEmitter_1 = require("../../util/LiteEmitter");
const Util_1 = require("../../util/Util");
const Part_1 = require("./Part");
const Storage_1 = require("../../util/Storage");
const fs_1 = require("fs");
/**
 * A part store.
 * @since 1.0.0
 */
class Store extends LiteEmitter_1.LiteEmitter {
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
         * All of the loaded parts.
         * @since 1.0.0
         */
        this.parts = new Storage_1.Collection();
        options = Object.assign(options, Store._defaults);
        this.client = client;
        this.name = name;
        this.client.stores.set(name, this);
        this.priority = (_a = options.priority) !== null && _a !== void 0 ? _a : -1;
        this.classToHandle = (_b = options.classToHandle) !== null && _b !== void 0 ? _b : Part_1.Part;
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
     * @returns {number} Total parts loaded.
     */
    async loadAll() {
        this.parts.clear();
        await Store.walkDir(this, this.directory);
        return this.parts.size;
    }
    /**
     * Resolves a string or part into... a part.
     * @param resolvable
     * @returns {Part} The resolved part.
     */
    resolve(resolvable) {
        if (typeof resolvable === "string")
            return this.parts.get(resolvable);
        else if (resolvable instanceof this.classToHandle)
            return resolvable;
        else
            return;
    }
    /**
     * Removes a part from the store.
     * @param resolvable The part to remove.
     * @since 1.0.0
     */
    remove(resolvable) {
        const comp = this.resolve(resolvable);
        if (comp) {
            this.emit("compRemoved", comp);
            this.parts.delete(comp.name);
            return comp;
        }
        return null;
    }
    /**
     * Adds a part to the store.
     * @param part
     * @since 1.0.0
     */
    add(part) {
        if (!(part instanceof this.classToHandle)) {
            this.emit("loadError", `Only ${this} can be added into this store.`);
            return null;
        }
        this.parts.delete(part.name);
        this.parts.set(part.name, part);
        this.emit("loaded", part);
        return part;
    }
    /**
     * Returns the string representation of this store.
     * @since 1.0.0
     */
    toString() {
        return this.name;
    }
}
exports.Store = Store;
Store._defaults = {
    priority: -1,
    classToHandle: Part_1.Part,
    autoCategory: false,
    loadFilter: () => true,
    createDirectory: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RydWN0dXJlcy9iYXNlL1N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDhDQUErQztBQUMvQywrQkFBMkM7QUFDM0Msd0RBQXFEO0FBQ3JELDBDQUF1QztBQUN2QyxpQ0FBMkM7QUFDM0MsZ0RBQWdEO0FBR2hELDJCQUEyQjtBQWUzQjs7O0dBR0c7QUFDSCxNQUFzQixLQUFzQixTQUFRLHlCQUFXO0lBbUQ3RDs7Ozs7O09BTUc7SUFDSCxZQUNFLE1BQW1CLEVBQ25CLElBQVksRUFDWixVQUF3QixFQUFFOztRQUUxQixLQUFLLEVBQUUsQ0FBQztRQWpEVjs7O1dBR0c7UUFDYSxVQUFLLEdBQTBCLElBQUksb0JBQVUsRUFBRSxDQUFDO1FBOEM5RCxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsYUFBYSxTQUFHLE9BQU8sQ0FBQyxhQUFhLG1DQUFJLFdBQUksQ0FBQztRQUNuRCxJQUFJLENBQUMsVUFBVSxTQUFHLE9BQU8sQ0FBQyxVQUFVLG1DQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGVBQWUsU0FBRyxPQUFPLENBQUMsZUFBZSxtQ0FBSSxJQUFJLENBQUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsU0FBRyxPQUFPLENB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