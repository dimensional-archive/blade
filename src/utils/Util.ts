export abstract class Util {
  public static array<T>(v: T | T[]): T[] {
    return Array.isArray(v) ? v : [ v ];
  }

  public static isFunction(i: any): i is Function {
    return typeof i === "function";
  }
}