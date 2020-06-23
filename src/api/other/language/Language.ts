import { LanguageHelper } from "./Helper";
import { Namespace } from "./Namespace";
import { IllegalArgumentError } from "@ayanaware/errors";
import { Util } from "../../../utils";
import { basename } from "path";

export interface Metadata {
  author?: string | string[];
  alias?: string | string[];
  id?: string;
}

export class Language {
  /**
   * The helper that loaded this language.
   * @since 1.0.5
   */
  public readonly helper: LanguageHelper;
  /**
   * The folder that belongs to this language.
   * @since 1.0.5
   */
  public readonly folder: string;
  /**
   * The different aliases for this language.
   * @since 1.0.5
   */
  public aliases: string[];
  /**
   * The author(s) that created this language.
   * @since 1.0.5
   */
  public authors: string[];
  /**
   * The id of this language.
   * @since 1.0.5
   */
  public id: string;

  /**
   * The namespaces that belong to this language.
   * @since 1.0.5
   */
  private readonly namespaces: Map<string, Namespace>;

  /**
   * @param helper
   * @param folder
   * @param metadata
   */
  public constructor(helper: LanguageHelper, folder: string, { id: _id, author, alias }: Metadata = {}) {
    this.helper = helper;
    this.namespaces = new Map();
    this.folder = folder;

    this.id = _id ?? basename(folder);
    this.authors = author ? Util.array(author) : [];
    this.aliases = alias ? Util.array(alias) : [];
  }

  /**
   * Dot notation shit: https://npmjs.com/package/dot-prop
   * @private
   */
  private static get(object: Record<string, any>, path: string, value?: any): any {
    if (!Util.isObject(object))
      return value === undefined ? object : value;

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
  public addNamespace(ns: Namespace): Map<string, Namespace> {
    return this.namespaces.set(ns.name, ns);
  }

  /**
   * Get a namespace by it's name.
   * @param ns The namespace to get.
   * @since 1.0.5
   */
  public getNamespace(ns: string): Namespace | undefined {
    return this.namespaces.get(ns)
  }

  /**
   * Get a translation.
   * @param path The path to the translation.
   * @param data Data to use.
   */
  public translate(path: string, data: Record<string, any> = {}): any {
    const regExp = /^(\w+):([\w_.]+)$/gi;
    if (!path.match(regExp))
      throw new IllegalArgumentError(`Path doesn't follow this format: "namespace:path"`);

    const [ , n, p ] = regExp.exec(path)!;

    let namespace = this.getNamespace(n);
    if (!namespace || !namespace.data) {
      const en = this.helper.storage.get(this.helper.fallbackLang);
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

