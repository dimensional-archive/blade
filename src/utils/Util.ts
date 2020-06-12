import { readdirSync, lstatSync } from "fs";
import { join } from "path";

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

  public static walk(directory: string, files: string[] = []): string[] {
    for (const path of readdirSync(directory)) {
      const joined = join(directory, path);
      if (path.endsWith(".js")) {
        files.push(joined);
      }
      else if (lstatSync(joined).isDirectory()) {
        files.concat(this.walk(joined, files));
      }
    }

    return files;
  }

  public static deepAssign<T>(o1, ...os): T {
    for (const o of os) {
      for (const [k, v] of Object.entries(o)) {
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
}