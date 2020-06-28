"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Part_1 = require("./base/Part");
const util_1 = require("../util");
const errors_1 = require("@ayanaware/errors");
class Language extends Part_1.Part {
    /**
     * @param store
     * @param dir
     * @param file
     * @param options
     */
    constructor(store, dir, file, options = {}) {
        var _a;
        super(store, dir, file, options);
        this.aliases = (_a = options.aliases) !== null && _a !== void 0 ? _a : [];
        this.author = options.author ? util_1.Util.array(options.author) : [];
        this.ns = new Map();
        for (const ns of store.namespaces) {
            const data = this[ns];
            if (data)
                this.ns.set(ns, data);
            else
                this.store.emit("namespaceMissing", this, ns);
        }
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
    addNamespace(ns, data) {
        return this.ns.set(ns, data);
    }
    /**
     * Get a namespace by it's name.
     * @param ns The namespace to get.
     * @since 1.0.5
     */
    getNamespace(ns) {
        return this.ns.get(ns);
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
            const en = this.store.parts.get(this.store.fallbackLanguage);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFnRDtBQUNoRCxrQ0FBK0I7QUFDL0IsOENBQXlEO0FBZXpELE1BQWEsUUFBUyxTQUFRLFdBQUk7SUFlaEM7Ozs7O09BS0c7SUFDSCxZQUNFLEtBQW9CLEVBQ3BCLEdBQVcsRUFDWCxJQUFjLEVBQ2QsVUFBMkIsRUFBRTs7UUFFN0IsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxPQUFPLFNBQUcsT0FBTyxDQUFDLE9BQU8sbUNBQUksRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUUvRCxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDcEIsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixJQUFJLElBQUk7Z0JBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDOztnQkFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLE1BQU0sQ0FBQyxHQUFHLENBQ2hCLE1BQTJCLEVBQzNCLElBQVksRUFDWixLQUFXO1FBRVgsSUFBSSxDQUFDLFdBQUksQ0FBQyxRQUFRLENBQUMs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