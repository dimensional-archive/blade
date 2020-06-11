import { Component, ComponentOptions } from "../components/Base";

export type LoadFilter = (file: string) => boolean | Promise<boolean>;

export interface ComponentStoreOptions {
  classToHandle?: typeof Component;
  priority?: number;
  loadFilter?: LoadFilter;
  autoCategory?: boolean;
  defaults?: ComponentOptions;
}
