export declare abstract class Util {
    static array<T>(v: T | T[]): T[];
    static isFunction(i: any): i is Function;
    static isClass(input: unknown): boolean;
    static walk(directory: string, files?: string[]): string[];
    static deepAssign<T>(o1: any, ...os: any[]): T;
    static flatMap(xs: any[], f: Function): any[];
    static intoCallable(thing: any): (...args: any[]) => any;
    static isPromise(value: any): value is Promise<any>;
    static prefixCompare(aKey: string | Function, bKey: string | Function): number;
    static choice<T>(...xs: T[]): T | null;
}
