import { ComponentStore } from "./Base";
import { ComponentStoreOptions } from "./Types";

export class CommandStore extends ComponentStore {
  public constructor(options: ComponentStoreOptions) {
    super("commands", options);
  }
}