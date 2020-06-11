import { LiteEmitter } from "../../utils/LiteEmitter";
import { ComponentStoreOptions, LoadFilter } from "./Types";
import { Component } from "../components/Base";
import { BladeClient } from "../Client";

export abstract class ComponentStore<T extends Component> extends LiteEmitter {
  private static _defaults: ComponentStoreOptions = {
    priority: -1,
    classToHandle: Component,
    autoCategory: false,
    loadFilter: () => true
  }


  public readonly client: BladeClient;
  public readonly modules: Map<string, T> = new Map();
  public readonly name: string;

  public priority: number;
  public classToHandle: typeof Component;
  public autoCategory: boolean;
  public loadFilter: LoadFilter;

  protected constructor(client: BladeClient, name: string, options: ComponentStoreOptions = {}) {
    super();
    options = Object.assign(options, ComponentStore._defaults);

    this.client = client;
    this.name = name;

    this.priority = options.priority ?? -1;
    this.classToHandle = options.classToHandle ?? Component;
    this.autoCategory = options.autoCategory ?? false;
    this.loadFilter = options.loadFilter ?? (() => false);

    if (options.defaults) options.classToHandle!.defaults = options.defaults;
  }
}
