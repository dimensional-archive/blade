import { sep } from "path";
import { ComponentStore } from "../stores/Base";
import { BladeClient } from "../Client";

/**
 * The base class for all components like Command and Listener.
 */
export abstract class Component {
  public readonly client: BladeClient;
  public readonly store: ComponentStore<Component>;

  public name: string;
  public disabled: boolean;
  public category: string;

  protected constructor(store: ComponentStore<Component>, path: string, options: ComponentOptions = {}) {
    options = Object.assign(options, Component._defaults);

    this.client = store.client;
    this.store = store;

    const sp = path.split(sep);
    this.name = options.name ?? sp[sp.length - 1].replace(".js", "");
    this.disabled = options.disabled ?? false;
    this.category = options.category ?? sp[sp.length - 2];
  }

  private static _defaults: ComponentOptions = {
    name: "",
    disabled: false,
    category: "General"
  }

  static set defaults(defaults: ComponentOptions) {
    this._defaults = defaults;
  }
}