export class Flags {
  public constructor() {
    Object.defineProperty(this, "_data", { value: {} });
  }

  /**
   * Raw parameters
   */
  private _data!: Dictionary<unknown>;

  /**
   * Set the raw parameter data.
   * @param data
   */
  public set data(data: Dictionary<unknown>) {
    Object.defineProperty(this, "_data", { value: data });
  }

  /**
   * Get a flag.
   * @param flag The flag to get.
   * @since 1.0.0
   */
  public get<T>(flag: string): T {
    return this._data[flag] as T;
  }

  /**
   * Set a flag value.
   * @param flag The flag to set.
   * @param value The flag value.
   * @since 1.0.0
   */
  public set(flag: string, value: unknown): Flags {
    this._data[flag] = value;
    return this;
  }

  /**
   * Whether or not a flag exists.
   * @param flag The flag to check
   * @since 1.0.0
   */
  public has(flag: string): boolean {
    const _flag = this._data[flag];
    return typeof _flag !== undefined && _flag !== null;
  }
}