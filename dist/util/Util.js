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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNEM7QUFDNUMsK0JBQTRCO0FBRTVCLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLFdBQVc7SUFDWCxXQUFXO0lBQ1gsYUFBYTtDQUNkLENBQUM7QUFFRixNQUFzQixJQUFJO0lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUksQ0FBVTtRQUMvQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFNO1FBQzdCLE9BQU8sT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWM7UUFDbEMsT0FBTyxPQUFPLEtBQUssS0FBSyxVQUFVO1lBQ2hDLE9BQU8sS0FBSyxDQUFDLFNBQVMsS0FBSyxRQUFRO1lBQ25DLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztJQUNqRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFVO1FBQy9CLE1BQU0sSUFBSSxHQUFHLE9BQU8sS0FBSyxDQUFDO1FBQzFCLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQVk7UUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDL0IsS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUV2QixLQUFLLElBQUksQ0FBQyxHQUFH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