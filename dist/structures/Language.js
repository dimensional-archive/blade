"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@ayanaware/errors");
const util_1 = require("../util");
const path_1 = require("path");
class Language {
    /**
     * @param helper
     * @param folder
     * @param metadata
     */
    constructor(helper, folder, { id: _id, author, alias } = {}) {
        this.helper = helper;
        this.namespaces = new Map();
        this.folder = folder;
        this.id = _id !== null && _id !== void 0 ? _id : path_1.basename(folder);
        this.authors = author ? util_1.Util.array(author) : [];
        this.aliases = alias ? util_1.Util.array(alias) : [];
    }
    /**
     * Dot notation shit: https://npmjs.com/package/dot-prop
     * @private
     */
    static get(object, path, value) {
        if (!util_1.Util.isObject(object))
            return value === undefined ? object : value;
        const pathArray = util_1.Util.getPathSegments(path);
        if (pathArray.length === 0)
            return;
        for (let i = 0; i < pathArray.length; i++) {
            if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i]))
                return value;
            object = object[pathArray[i]];
            if (object === undefined || object === null) {
                if (i !== pathArray.length - 1)
                    return value;
                break;
            }
        }
        return object;
    }
    /**
     * Add a namespace to the map of namespaces.
     * @param ns The namespace to set.
     * @since 1.0.5
     */
    addNamespace(ns) {
        return this.namespaces.set(ns.name, ns);
    }
    /**
     * Get a namespace by it's name.
     * @param ns The namespace to get.
     * @since 1.0.5
     */
    getNamespace(ns) {
        return this.namespaces.get(ns);
    }
    /**
     * Get a translation.
     * @param path The path to the translation.
     * @param data Data to use.
     */
    translate(path, data = {}) {
        const regExp = /^(\w+):([\w_.]+)$/gi;
        if (!path.match(regExp))
            throw new errors_1.IllegalArgumentError(`Path doesn't follow this format: "namespace:path"`);
        const [, n, p] = regExp.exec(path);
        let namespace = this.getNamespace(n);
        if (!namespace || !namespace.data) {
            const en = this.helper.storage.get(this.helper.fallbackLang);
            namespace = en.getNamespace(n);
            if (!namespace)
                return `Incorrect or missing namespace: "${n}"`;
        }
        let value = Language.get(namespace.data, p);
        if (!value)
            return `Incorrect or missing path: "${p}"`;
        // Formatting
        if (util_1.Util.isFunction(value))
            value = value(...Object.values(data));
        if (typeof value === "string") {
            for (const key of Object.keys(data)) {
                value = value.replace(new RegExp(`{{${key}}}`, "gim"), data[key]);
            }
        }
        return value;
    }
}
exports.Language = Language;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUF5RDtBQUN6RCxrQ0FBK0I7QUFDL0IsK0JBQWdDO0FBUWhDLE1BQWEsUUFBUTtJQWlDbkI7Ozs7T0FJRztJQUNILFlBQW1CLE1BQXNCLEVBQUUsTUFBYyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxLQUFlLEVBQUU7UUFDbEcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxhQUFILEdBQUcsY0FBSCxHQUFHLEdBQUksZUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUEyQixFQUFFLElBQVksRUFBRSxLQUFXO1FBQ3ZFLElBQUksQ0FBQyxXQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN4QixPQUFPLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRTlDLE1BQU0sU0FBUyxHQUFHLFdBQUksQ0FBQyxlQUFl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