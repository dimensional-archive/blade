import { Handler, HandlerOptions } from "../base/Handler";
import { Language } from "./Language";

import type { BladeClient } from "../../Client";
import type { ModuleResolvable } from "../base/Module";

export class LanguageHandler extends Handler<Language> {
  /**
   * The language to fallback on in case an incorrect language was provided.
   */
  public fallbackLanguage: string;

  /**
   * The primary namespace.
   */
  public primaryNamespace: string;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: LanguageHandlerOptions) {
    super(client, "languages", {
      ...options,
      class: Language
    });

    this.primaryNamespace = options.primaryNamespace;
    this.fallbackLanguage = options.fallbackLanguage ?? "en-US";
  }

  /**
   * Get a language.
   * @param resolvable A language alias/id or an instance of a language.
   */
  public get(resolvable: ModuleResolvable<Language>): Language | undefined {
    if (typeof resolvable === "string") return this.store.find(l => l.aliases.includes(resolvable));
    else if (resolvable instanceof this.class) return resolvable;
    return;
  }

  /**
   * Get a translation
   * @param lang The language id or alias.
   * @param path The path to the translation
   * @param context The context to use.
   */
  public translate<T>(lang: string, path: string, context: Dictionary = {}): Promise<T> {
    const language = this.get(lang);
    if (!language) throw new Error(`Missing Language: ${lang}`);
    return language.translate<T>(path, context);
  }
}

export interface LanguageHandlerOptions extends HandlerOptions {
  primaryNamespace: string;
  fallbackLanguage?: string;
}
