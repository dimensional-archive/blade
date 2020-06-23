"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const errors_1 = require("@ayanaware/errors");
const utils_1 = require("../../../utils");
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
        this.authors = author ? utils_1.Util.array(author) : [];
        this.aliases = alias ? utils_1.Util.array(alias) : [];
    }
    /**
     * Dot notation shit: https://npmjs.com/package/dot-prop
     * @private
     */
    static get(object, path, value) {
        if (!utils_1.Util.isObject(object))
            return value === undefined ? object : value;
        const pathArray = utils_1.Util.getPathSegments(path);
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
        const [, n, p] = regExp.exec(path), namespace = this.getNamespace(n);
        if (!namespace || !namespace.data)
            return `Incorrect or missing namespace: ${n}`;
        let value = Language.get(namespace.data, p);
        if (!value)
            return `Incorrect or missing path: "${p}"`;
        // Formatting
        if (utils_1.Util.isFunction(value))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL290aGVyL2xhbmd1YWdlL0xhbmd1YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDhDQUF5RDtBQUN6RCwwQ0FBc0M7QUFDdEMsK0JBQWdDO0FBVWhDLE1BQWEsUUFBUTtJQWlDbkI7Ozs7T0FJRztJQUNILFlBQW1CLE1BQXNCLEVBQUUsTUFBYyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxLQUFlLEVBQUU7UUFDbEcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxhQUFILEdBQUcsY0FBSCxHQUFHLEdBQUksZUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUEyQixFQUFFLElBQVksRUFBRSxLQUFXO1FBQ3ZFLElBQUksQ0FBQyxZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN4QixPQUFPLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRTlDLE1BQU0sU0FBUyxHQUFH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