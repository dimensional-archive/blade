import { LiteEmitter, Storage, Util } from "../../../utils";
import { Language, Metadata } from "./Language";
import { lstatSync, readdirSync, readFileSync } from "fs";
import { join, relative, sep } from "path";
import { BladeClient } from "../../Client";
import { IllegalArgumentError, ParseError } from "@ayanaware/errors";

export type Parser = (...args: any[]) => any;

export interface LanguageHelperOptions {
  createDirectory?: boolean;
  directory?: string;
  parse?: Parser;
}

export class LanguageHelper extends LiteEmitter {
  /**
   * The client that is using this store.
   * @since 1.0.5
   */
  public readonly client: BladeClient;
  /**
   * All of the loaded languages.
   * @since 1.0.5
   */
  public readonly storage: Storage<string, Language>;

  /**
   * Whether to create the directory if none exists.
   * @since 1.0.5
   */
  public createDirectory: boolean;
  /**
   * The directory to load from.
   * @since 1.0.5
   */
  public directory: string;
  /**
   * The parser for metadata files.
   * @since 1.0.5
   */
  public parse: Parser;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: LanguageHelperOptions = {}) {
    super();

    this.client = client;
    this.storage = new Storage();

    this.createDirectory = options.createDirectory ?? true;
    this.directory = options.directory ?? join(client.directory, "locales");
    this.parse = options.parse ?? JSON.parse;
  }

  /**
   * Load all languages and their namespaces.
   * @since 1.0.5
   */
  public async loadAll() {
    this.storage.clear();

    for (const path of readdirSync(this.directory)) {
      const joined = join(this.directory, path);
      if (lstatSync(joined).isDirectory()) {
        const files = readdirSync(joined);
        if (files.length > 0) {
          let metadata: Metadata = {};
          if (files.some(p => p.match(/meta.(?:yml|json)/g))) {
            for await (const file of files) {
              if (!/meta.(?:yml|json)/g.test(file)) continue;
              metadata = await this.parse(readFileSync(join(joined, file), { encoding: "utf-8" }));
              break;
            }
          }

          const language = new Language(this, joined, metadata),
            ns = Util.walk(joined);

          ns.map((file) => this.load(language, relative(joined, file).split(sep)))
          this.storage.set(language.id, language);
        }
      }
    }
  }

  /**
   * Loads a namespace.
   * @param language The language that
   * @param file
   * @since 1.0.5
   */
  public async load(language: Language, file: string[]) {
    const loc = join(language.folder, ...file);

    try {
      const _ = await import(loc),
        loaded = 'default' in _ ? _.default : _;

      if (!Util.isClass(loaded))
        throw new ParseError('The exported structure is not a class.');

      const ns = new loaded(language, file);
      language.addNamespace(ns);
      this.emit("loaded", ns);
    } catch (e) {
      this.emit("loadError", new ParseError(`Couldn't parse file ${file}`).setCause(e));
    }

    delete require.cache[loc];
    module.children.pop();
  }

  /**
   * Get a translation by it's path.
   * @since 1.0.5
   */
  public translate<T = string>(lang: string, path: string, data: Record<string, any> = {}): T {
    const language = this.storage.get(lang);
    if (!language) throw new IllegalArgumentError(`Language ${lang} does not exist.`);
    return language.translate(path, data);
  }
}
