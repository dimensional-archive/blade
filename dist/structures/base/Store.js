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
const Component_1 = require("./Component");
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
        this.classToHandle = (_b = options.classToHandle) !== null && _b !== void 0 ? _b : Component_1.Part;
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
    classToHandle: Component_1.Part,
    autoCategory: false,
    loadFilter: () => true,
    createDirectory: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RydWN0dXJlcy9iYXNlL1N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDhDQUErQztBQUMvQywrQkFBMkM7QUFDM0Msd0RBQXFEO0FBQ3JELDBDQUF1QztBQUN2QywyQ0FBZ0Q7QUFDaEQsZ0RBQWdEO0FBR2hELDJCQUEyQjtBQWUzQjs7O0dBR0c7QUFDSCxNQUFzQixLQUFzQixTQUFRLHlCQUFXO0lBbUQ3RDs7Ozs7O09BTUc7SUFDSCxZQUNFLE1BQW1CLEVBQ25CLElBQVksRUFDWixVQUF3QixFQUFFOztRQUUxQixLQUFLLEVBQUUsQ0FBQztRQWpEVjs7O1dBR0c7UUFDYSxVQUFLLEdBQTBCLElBQUksb0JBQVUsRUFBRSxDQUFDO1FBOEM5RCxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFFBQVEsU0FBRyxPQUFPLENBQUMsUUFBUSxtQ0FBSSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsYUFBYSxTQUFHLE9BQU8sQ0FBQyxhQUFhLG1DQUFJLGdCQUFJLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsU0FBRyxPQUFPLENBQUMsVUFBVSxtQ0FBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxlQUFlLFNBQUcsT0FBTyxDQUFDLGVBQWUsbUNBQUksSUFBSSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxTQUFTLFNBQUcsT0FBTyxD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