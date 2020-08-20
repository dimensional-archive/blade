import { Module, ModuleOptions } from "../base/Module";
import { doesExist, Doti, isObj, isPromise, isString } from "../../util";

import type { BladeClient } from "../../Client";
import type { LanguageHandler } from "./LanguageHandler";

/**
 * Declare a language namespace.
 */
export const namespace: PropertyDecorator = (target: Dictionary, propertyKey: PropertyKey): void => {
  const namespaces: Set<string> = Reflect.getMetadata(LANGUAGE_NAMESPACES, target) ?? new Set();

  if (!namespaces.has(propertyKey.toString())) {
    namespaces.add(propertyKey.toString());
    Reflect.defineMetadata(LANGUAGE_NAMESPACES, namespaces, target);
  }

  return;
};

/**
 * Symbol used for namespace storage.
 */
export const LANGUAGE_NAMESPACES = Symbol.for("LanguageNamespaces");

/**
 * RegExp Used for Parsing a translation path
 */
export const TRANSLATION_PATH_REGEXP = /^(?:([a-z]+):)?([a-z.]+)(\[(\d)])?$/i;

/**
 * RegExp for matching string interpolation.
 */
export const INTERPOLATION_REGEXP = /#{([a-z.]+)}/i;

export class Language extends Module<LanguageOptions> {
  /**
   * The language handler.
   */
  public handler!: LanguageHandler

  /**
   * Language Aliases to use.
   */
  public aliases: string[];

  /**
   * Language Metadata.
   */
  public meta?: Dictionary;

  /**
   * Pass the entire context object instead of it's values.
   */
  public passContextObject: boolean;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: LanguageOptions = {}) {
    super(client, options);

    this.aliases = (options.aliases ?? []).concat(this.id);
    this.meta = options.meta;
    this.passContextObject = options.passContextObject ?? false;
  }

  /**
   * The namespaces associated with this language.
   */
  public get namespaces(): Set<string> {
    return Reflect.getMetadata(LANGUAGE_NAMESPACES, this);
  }

  /**
   * Get a translation.
   * @param path The translation path.
   * @param context The context to use when translating.
   */
  public async translate<T>(path: string, context: Dictionary = {}): Promise<T> {
    // eslint-disable-next-line prefer-const
    let [ , ns, p, iw, i ] = TRANSLATION_PATH_REGEXP.exec(path)!;
    ns = ns ?? this.handler.primaryNamespace;
    p = i ? `${p}${iw}` : p;

    // @ts-ignore
    const data = this[ns];
    if (!this.namespaces.has(ns) || !isObj(data)) throw `Missing or incorrect namespace: ${ns}`;
    if (i) p = p.slice(0, p.length - iw.length);

    let v = Doti.get<unknown>(data, p);
    if (doesExist(v)) {
      if (typeof v === "function") {
        const parameters = this.passContextObject ? [ context ] : Object.values(context);
        v = v.call(this, ...parameters);
        if (isPromise(v)) v = await v;
      }

      if (Array.isArray(v) && i) v = v[+i];

      if (isString(v)) {
        let r: RegExpExecArray | null;
        while ((r = INTERPOLATION_REGEXP.exec(v as string)) !== null) {
          const val = Doti.get(context, r[1]);
          v = (v as string).replace(r[0], val ? String(val) : "");
        }
      }

      return v as T;
    }

    throw `Missing translation for "${path}"`;
  }
}

/**
 * A helper decorator for applying options to a inhibitor.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function language(options: LanguageOptions = {}) {
  return <T extends new (...args: any[]) => Language>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

export type TFunction<T = string> = (path: string, context?: Dictionary) => Promise<T>;

export interface LanguageOptions extends ModuleOptions {
  aliases?: string[];
  meta?: Dictionary;
  passContextObject?: boolean;
}

