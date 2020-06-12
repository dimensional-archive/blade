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
}