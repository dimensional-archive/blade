import { Store, StoreOptions, ComponentResolvable } from "./base/Store";

import type { BladeClient } from "../Client";
import { Extendable } from "./Extendable";

export class ExtendableStore extends Store<Extendable> {
  constructor(client: BladeClient, options: StoreOptions = {}) {
    super(client, "extendables", {
      classToHandle: Extendable,
      ...options,
    });
  }

  /**
	 * Removes an extendable from the store.
   * @param extendable The extendable to remove
	 * @since 1.0.6
	 */
  public remove(extendable: ComponentResolvable<Extendable>): Extendable | null {
    const exte = super.remove(extendable);
    if (!exte) return null;
    exte.disable();
    return exte;
  }

  /**
   * Adds an extendable to this store.
   * @param extendable The extendable to add.
   * @since 1.0.6
   */
  public add(extendable: Extendable): Extendable | null {
    const exte = super.add(extendable);
    if (!exte) return null;
    exte.init();
    return exte;
  }
}
