import { ReplyBuilder, Context } from "./command";

export interface IStructures {
  context: typeof Context;
  replyBuilder: typeof ReplyBuilder;
}

export abstract class Structures {
  private static _structures: IStructures = {
    context: Context,
    replyBuilder: ReplyBuilder,
  };

  /**
   * Extend a part used by blade.
   * @since 1.0.6
   */
  public static extend<K extends keyof IStructures, B extends IStructures[K]>(
    structure: K,
    extender: (base: IStructures[K]) => B | B
  ): typeof Structures {
    this._structures[structure] =
      typeof extender === "function"
        ? extender(this._structures[structure])
        : extender;

    return this;
  }

  /**
   * Get a part.
   * @param part The part to get.
   * @since 1.0.6
   */
  public static get<K extends keyof IStructures>(structure: K): IStructures[K] {
    return this._structures[structure];
  }
}
