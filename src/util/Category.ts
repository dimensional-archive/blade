import { ProxyStore } from "@kyudiscord/neo";

import type { Module } from "../components/base/Module";
import type { Handler } from "../components/base/Handler";

export class Category<T extends Module> extends ProxyStore<string, T> {
  /**
   * The ID of this category.
   */
  public readonly id: string;

  /**
   * @param handler
   * @param id
   * @param commands
   */
  public constructor(handler: Handler<T>, id: string, commands?: string[]) {
    commands = commands ?? [ ...handler.store.filter(c => c.categoryId === id).keys() ];
    super(handler.store, commands);

    this.id = id;
  }
}