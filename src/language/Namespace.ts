import { Logger } from "@ayanaware/logger";
import { BladeClient } from "../Client";
import { Language } from "../structures/Language";
import { PartOptions, Part } from "../structures/base/Component";

export class Namespace {
  /**
   * This namespaces logger.
   * @since 1.0.5
   */
  public readonly logger: Logger;
  /**
   * The blade client.
   * @since 1.0.5
   */
  public readonly client: BladeClient;
  /**
   * The language this namespace belongs to.
   * @since 1.0.5
   */
  public readonly language: Language;

  /**
   * The file array of this part.
   * @since 1.0.0
   */
  public file: string[];
  /**
   * The directory that holds this part.
   * @since 1.0.0
   */
  public directory: string;
  /**
   * THe name of this part
   * @since 1.0.0
   */
  public name: string;

  public constructor(language: Language, file: string[], options: Omit<PartOptions, "category" | "disabled"> = {}) {
    this.client = language.helper.client;
    this.language = language;

    this.name = options.name ?? file[file.length - 1].slice(0, -3);
    this.directory = language.folder;
    this.file = file;

    this.logger = Logger.custom(this.name, "@kyu/blade", () => `locales.${this.language.id}.`)
  }

  /**
   * The namespace data getter.
   */
  public get data(): Record<string, any> {
    return {}
  }

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating this listener.
   * @constructor
   */
  public static Setup(options: PartOptions): <T extends new (...args: any[]) => Part>(t: T) => T {
    return Part.Setup(options);
  }
}

