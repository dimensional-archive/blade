import { Store, StoreOptions } from "./base/Store";
import { Language } from "./Language";
import { BladeClient } from "../Client";
import { IllegalArgumentError } from "@ayanaware/errors";

export interface LanguageStoreOptions extends StoreOptions {
  /**
   * An array of namespaces to use.
   */
  namespaces: string[];
  /**
   * The fallback language.
   */
  fallbackLanguage?: string;
}

export class LanguageStore extends Store<Language> {
  /**
   * Namespaces to use.
   * @since 1.0.11
   */
  public namespaces: string[];
  /**
   * The default language.
   * @since 1.0.11
   */
  public fallbackLanguage: string;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: LanguageStoreOptions) {
    super(client, "locales", {
      classToHandle: Language,
      ...options,
    });

    this.namespaces = options.namespaces;
    this.fallbackLanguage = options.fallbackLanguage ?? "en-US";
  }

  /**
   * Get a translation by it's path.
   * @since 1.0.5
   */
  public translate<T = string>(
    lang: string,
    path: string,
    data: Record<string, any> = {}
  ): T {
    let language = this.parts.get(lang);
    if (!language) {
      language = this.parts.get(this.fallbackLanguage);
      if (!language)
        throw new IllegalArgumentError(`Language ${lang} does not exist.`);
    }

    return language.translate(path, data);
  }
}
