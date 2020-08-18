import { Store } from "@kyudiscord/neo";

export abstract class Provider<V extends any> {
  public items: Store<string, V> = new Store();

  public abstract init(): Promise<unknown>;

  public abstract get<T>(id: string, path?: string): T | V;

  public abstract delete(id: string, path?: string): unknown | Promise<unknown>;

  public abstract update(id: string, value: unknown, path?: string): unknown | Promise<unknown>;
}