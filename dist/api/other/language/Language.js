"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL290aGVyL2xhbmd1YWdlL0xhbmd1YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsOENBQXlEO0FBQ3pELDBDQUFzQztBQUN0QywrQkFBZ0M7QUFRaEMsTUFBYSxRQUFRO0lBaUNuQjs7OztPQUlHO0lBQ0gsWUFBbUIsTUFBc0IsRUFBRSxNQUFjLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEtBQWUsRUFBRTtRQUNsRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLGFBQUgsR0FBRyxjQUFILEdBQUcsR0FBSSxlQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRDs7O09BR0c7SUFDSyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQTJCLEVBQUUsSUFBWSxFQUFFLEtBQVc7UUFDdkUsSUFBSSxDQUFDLFlBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3hCLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFOUMsTUFBTSxTQUFTLEdBQUcs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