import { Context, ReplyBuilder } from "./components";

export interface IComponents {
  context: typeof Context;
  replyBuilder: typeof ReplyBuilder;
}

export abstract class Components {
  private static _components: IComponents = {
    context: Context,
    replyBuilder: ReplyBuilder,
  };

  /**
   * Extend a component used by blade.
   * @since 1.0.6
   */
  public static extend<K extends keyof IComponents, B extends IComponents[K]>(
    component: K,
    extender: (base: IComponents[K]) => B | B
  ): typeof Components {
    this._components[component] =
      typeof extender === "function"
        ? extender(this._components[component])
        : extender;

    return this;
  }

  /**
   * Get a component.
   * @param component The component to get.
   * @since 1.0.6
   */
  public static get<K extends keyof IComponents>(component: K): IComponents[K] {
    return this._components[component];
  }
}
