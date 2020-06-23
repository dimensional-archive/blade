"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9VdGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUE0QztBQUM1QywrQkFBNEI7QUFFNUIsTUFBTSxjQUFjLEdBQUc7SUFDckIsV0FBVztJQUNYLFdBQVc7SUFDWCxhQUFhO0NBQ2QsQ0FBQztBQUVGLE1BQXNCLElBQUk7SUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBSSxDQUFVO1FBQy9CLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO0lBQ3RDLENBQUM7SUFFTSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQU07UUFDN0IsT0FBTyxPQUFPLENBQUMsS0FBSyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBYztRQUNsQyxPQUFPLE9BQU8sS0FBSyxLQUFLLFVBQVU7WUFDaEMsT0FBTyxLQUFLLENBQUMsU0FBUyxLQUFLLFFBQVE7WUFDbkMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO0lBQ2pELENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQVU7UUFDL0IsTUFBTSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7UUFDMUIsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBWTtRQUN4QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUMvQixLQUFLLEdBQWEsRUFBRSxDQUFDO1FBRXZCLEtBQUssSUFBSSxDQUFDLEdB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