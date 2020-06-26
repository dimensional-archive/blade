"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const disallowedKeys = [
    '__proto__',
    'prototype',
    'constructor'
];
class Util {
    static array(v) {
        return Array.isArray(v) ? v : [v];
    }
    static isFunction(i) {
        return typeof i === "function";
    }
    static isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }
    static isObject(value) {
        const type = typeof value;
        return value !== null && (type === 'object' || type === 'function');
    }
    static getPathSegments(path) {
        const pathArray = path.split('.'), parts = [];
        for (let i = 0; i < pathArray.length; i++) {
            let p = pathArray[i];
            while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
                p = p.slice(0, -1) + '.';
                p += pathArray[++i];
            }
            parts.push(p);
        }
        return parts.some(segment => disallowedKeys.includes(segment)) ? [] : parts;
    }
    static walk(directory, files = []) {
        for (const path of fs_1.readdirSync(directory)) {
            const joined = path_1.join(directory, path);
            if (path.endsWith(".js")) {
                files.push(joined);
            }
            else if (fs_1.lstatSync(joined).isDirectory()) {
                files.concat(this.walk(joined, files));
            }
        }
        return files;
    }
    static deepAssign(o1, ...os) {
        for (const o of os) {
            for (const [k, v] of Object.entries(o)) {
                const vIsObject = v && typeof v === 'object';
                const o1kIsObject = Object.prototype.hasOwnProperty.call(o1, k) && o1[k] && typeof o1[k] === 'object';
                if (vIsObject && o1kIsObject) {
                    Util.deepAssign(o1[k], v);
                }
                else {
                    o1[k] = v;
                }
            }
        }
        return o1;
    }
    static flatMap(xs, f) {
        const res = [];
        for (const x of xs) {
            res.push(...f(x));
        }
        return res;
    }
    static intoCallable(thing) {
        if (typeof thing === "function") {
            return thing;
        }
        return () => thing;
    }
    static isPromise(value) {
        return value
            && typeof value.then === 'function'
            && typeof value.catch === 'function';
    }
    static prefixCompare(aKey, bKey) {
        if (aKey === "" && bKey === "")
            return 0;
        if (aKey === "")
            return 1;
        if (bKey === "")
            return -1;
        if (typeof aKey === "function" && typeof bKey === "function")
            return 0;
        if (typeof aKey === "function")
            return 1;
        if (typeof bKey === "function")
            return -1;
        return aKey.length === bKey.length
            ? aKey.localeCompare(bKey)
            : bKey.length - aKey.length;
    }
    static choice(...xs) {
        for (const x of xs) {
            if (x != null) {
                return x;
            }
        }
        return null;
    }
}
exports.Util = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9VdGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTRDO0FBQzVDLCtCQUE0QjtBQUU1QixNQUFNLGNBQWMsR0FBRztJQUNyQixXQUFXO0lBQ1gsV0FBVztJQUNYLGFBQWE7Q0FDZCxDQUFDO0FBRUYsTUFBc0IsSUFBSTtJQUNqQixNQUFNLENBQUMsS0FBSyxDQUFJLENBQVU7UUFDL0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBTTtRQUM3QixPQUFPLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQztJQUNqQyxDQUFDO0lBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFjO1FBQ2xDLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVTtZQUNoQyxPQUFPLEtBQUssQ0FBQyxTQUFTLEtBQUssUUFBUTtZQUNuQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUM7SUFDakQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBVTtRQUMvQixNQUFNLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQztRQUMxQixPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFZO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQy9CLEtBQUssR0FBYSxFQUFFLENBQUM7UUFFdkIsS0FBSyxJQUFJLENBQUMsR0FB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