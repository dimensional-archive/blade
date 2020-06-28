import { PartOptions, Part } from "./base/Part";
import { Util } from "../util";
import { IllegalArgumentError } from "@ayanaware/errors";

import type { LanguageStore } from "./LanguageStore";

export interface LanguageOptions extends PartOptions {
  /**
   * The different aliases of this language.
   */
  aliases?: string[];
  /**
   * The authors that created this language file.
   */
  author?: string | string[];
}

export class Language extends Part {
  public readonly store!: LanguageStore;
  public readonly ns: Map<string, Record<string, any>>;

  /**
   * The aliases of this language.
   * @since 1.0.11
   */
  public aliases: string[];
  /**
   * The authors of this language.
   * @since 1.0.11
   */
  public author: string[];

  /**
   * @param store
   * @param dir
   * @param file
   * @param options
   */
  public constructor(
    store: LanguageStore,
    dir: string,
    file: string[],
    options: LanguageOptions = {}
  ) {
    super(store, dir, file, options);

    this.aliases = options.aliases ?? [];
    this.author = options.author ? Util.array(options.author) : [];

    this.ns = new Map();
    for (const ns of store.namespaces) {
      const data = this[ns];
      if (data) this.ns.set(ns, data);
      else this.store.emit("namespaceMissing", this, ns);
    }
  }

  /**
   * Dot notation shit: https://npmjs.com/package/dot-prop
   * @private
   */
  private static get(
    object: Record<string, any>,
    path: string,
    value?: any
  ): any {
    if (!Util.isObject(object)) return value === undefined ? object : value;

    const pathArray = Util.getPathSegments(path);
    if (pathArray.length === 0) return;

    for (let i = 0; i < pathArray.length; i++) {
      if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i]))
        return value;

      object = object[pathArray[i]];

      if (object === undefined || object === null) {
        if (i !== pathArray.length - 1) return value;
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
  public addNamespace(
    ns: string,
    data: Record<string, any>
  ): Map<string, Record<string, any>> {
    return this.ns.set(ns, data);
  }

  /**
   * Get a namespace by it's name.
   * @param ns The namespace to get.
   * @since 1.0.5
   */
  public getNamespace(ns: string): Record<string, any> | undefined {
    return this.ns.get(ns);
  }

  /**
   * Get a translation.
   * @param path The path to the translation.
   * @param data Data to use.
   */
  public translate(path: string, data: Record<string, any> = {}): any {
    const regExp = /^(\w+):([\w_.]+)$/gi;
    if (!path.match(regExp))
      throw new IllegalArgumentError(
        `Path doesn't follow this format: "namespace:path"`
      );

    const [, n, p] = regExp.exec(path)!;

    let namespace = this.getNamespace(n);
    if (!namespace || !namespace.data) {
      const en = this.store.parts.get(this.store.fallbackLanguage);
      namespace = en!.getNamespace(n);
      if (!namespace) return `Incorrect or missing namespace: "${n}"`;
    }

    let value = Language.get(namespace.data, p);
    if (!value) return `Incorrect or missing path: "${p}"`;

    // Formatting
    if (Util.isFunction(value)) value = value(...Object.values(data));
    if (typeof value === "string") {
      for (const key of Object.keys(data)) {
        value = value.replace(new RegExp(`{{${key}}}`, "gim"), data[key]);
      }
    }

    return value;
  }
}
