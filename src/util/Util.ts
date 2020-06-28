import { lstatSync, readdirSync } from "fs";
import { join } from "path";

const disallowedKeys = [
  '__proto__',
  'prototype',
  'constructor'
];

export abstract class Util {
  public static array<T>(v: T | T[]): T[] {
    return Array.isArray(v) ? v : [ v ];
  }

  public static isFunction(i: any): i is Function {
    return typeof i === "function";
  }

  public static isClass(input: unknown): boolean {
    return typeof input === 'function' &&
      typeof input.prototype === 'object' &&
      input.toString().substring(0, 5) === 'class';
  }

  public static isObject(value: any): boolean {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
  }

  public static getPathSegments(path: string) {
    const pathArray = path.split('.'),
      parts: string[] = [];

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

  public static walk(directory: string, files: string[] = []): string[] {
    for (const path of readdirSync(directory)) {
      const joined = join(directory, path);
      if (path.endsWith(".js")) {
        files.push(joined);
      } else if (lstatSync(joined).isDirectory()) {
        files.concat(this.walk(joined, files));
      }
    }

    return files;
  }

  public static deepAssign<T>(o1, ...os): T {
    for (const o of os) {
      for (const [ k, v ] of Object.entries(o)) {
        const vIsObject = v && typeof v === 'object';
        const o1kIsObject = Object.prototype.hasOwnProperty.call(o1, k) && o1[k] && typeof o1[k] === 'object';
        if (vIsObject && o1kIsObject) {
          Util.deepAssign(o1[k], v);
        } else {
          o1[k] = v;
        }
      }
    }

    return o1;
  }

  public static flatMap(xs: any[], f: Function): any[] {
    const res: any[] = [];
    for (const x of xs) {
      res.push(...f(x));
    }

    return res;
  }

  public static intoCallable(thing: any): (...args: any[]) => any {
    if (typeof thing === "function") {
      return thing;
    }

    return () => thing;
  }

  public static isPromise(value: any): value is Promise<any> {
    return value
      && typeof value.then === 'function'
      && typeof value.catch === 'function';
  }

  public static prefixCompare(
    aKey: string | Function,
    bKey: string | Function
  ): number {
    if (aKey === "" && bKey === "") return 0;
    if (aKey === "") return 1;
    if (bKey === "") return -1;
    if (typeof aKey === "function" && typeof bKey === "function") return 0;
    if (typeof aKey === "function") return 1;
    if (typeof bKey === "function") return -1;
    return aKey.length === bKey.length
      ? aKey.localeCompare(bKey)
      : bKey.length - aKey.length;
  }

  public static choice<T>(...xs: T[]): T | null {
    for (const x of xs) {
      if (x != null) {
        return x;
      }
    }

    return null;
  }
}