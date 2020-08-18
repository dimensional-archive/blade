import type { Constructor } from "@kyudiscord/neo";

/**
 * A helper function for determining whether something is a class.
 * @param input
 * @since 2.0.0
 */
export function isClass(input: unknown): input is Constructor<unknown> {
  return (
    typeof input === "function"
    && typeof input.prototype === "object"
    && input.toString().substring(0, 5) === "class"
  );
}

/**
 * A helper function for capitalizing the first letter in the sentence.
 * @param str
 * @param lowerRest
 * @since 2.0.0
 */
export function capitalize(str: string, lowerRest = false): string {
  const [ f, ...r ] = str.split("");
  return `${f.toUpperCase()}${lowerRest ? r.join("").toLowerCase() : r.join("")}`;
}

String.prototype.capitalize = function (lowerRest = false) {
  return capitalize(this.toString(), lowerRest);
};

/**
 * Combines two words into one.
 * @param a The first word
 * @param b The second word
 * @author Sxmurai
 */
export function combine(a: string, b: string): string {
  let c = "";
  c += a.substring(0, (Math.ceil(a.length / 2) - 1) + 1);
  c += b.substring(Math.ceil(b.length / 2) - 1);
  return c;
}

/**
 * A helper function for determining if a value is an event emitter.
 * @param input
 * @since 2.0.0
 */
export function isEmitter(input: unknown): input is EventEmitterLike {
  return (input !== "undefined" && input !== void 0)
    && typeof (input as EventEmitterLike).on === "function"
    && typeof (input as EventEmitterLike).emit === "function";
}

/**
 * Returns an array.
 * @param v
 * @since 2.0.0
 */
export function array<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [ v ];
}

/**
 * A helper function for determining if a value is a string.
 * @param value
 * @since 2.0.0
 */
export function isString(value: unknown): value is string {
  return value !== null
    && value !== "undefined"
    && typeof value === "string";
}

/**
 * A helper function for determining whether or not a value is a promise,
 * @param value
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return value
    && typeof (value as Promise<unknown>).then === "function"
    && typeof (value as Promise<unknown>).catch === "function";
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function intoCallable(value: unknown): Function {
  return typeof value === "function"
    ? value
    : () => value;
}

/**
 * Code block template tag.
 * @param strings
 * @param values
 */
export function code(strings: TemplateStringsArray, ...values: unknown[]): string;
/**
 * Creates a typed code block template tag.
 * @param type The type of code block.
 */
export function code(type: string): TemplateTag;
export function code(...args: unknown[]): string | TemplateTag {
  const block = (type?: string): TemplateTag =>
    (strings: TemplateStringsArray, ...values: unknown[]) =>
      `\`\`\`${type ?? ""}\n${strings.map((s, i) => s + (values[i] ?? "")).join("")}\n\`\`\``;

  return typeof args[0] === "string"
    ? block(args.shift() as string)
    : block()(args[0] as TemplateStringsArray, ...args.slice(1));
}

/**
 * Merges objects into one.
 * @param objects The objects to merge.
 */
export function mergeObjects<O extends Dictionary = Dictionary>(...objects: Partial<O>[]): O {
  const o: Dictionary = {};
  for (const object of objects) {
    for (const key of Object.keys(object))
      if (o[key] === null || o[key] === void 0)
        o[key] = object[key];
  }

  return o as O;
}

export type TemplateTag = (strings: TemplateStringsArray, ...values: unknown[]) => string;
