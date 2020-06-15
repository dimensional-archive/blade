import { Storage } from "../../utils";

export abstract class Provider<V extends any> {
  protected storage: Storage<string, V> = new Storage();

  public abstract init(): Promise<any>;

  public abstract get<T>(id: string, path?: string): T | Provider<T>;

  public abstract delete(id: string, path?: string): any | Promise<any>;

  public abstract update(id: string, value: any, path?: string): any | Promise<any>;
}
