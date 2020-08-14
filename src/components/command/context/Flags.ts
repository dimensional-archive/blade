export class Flags {
  /**
   * Raw parameters
   */
  private _data: Dictionary<unknown> = {}

  /**
   * Set the raw parameter data.
   * @param data
   */
  public set data(data: Dictionary<unknown>) {
    this._data = data;
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
   * Whether or not a flag exists.
   * @param flag The flag to check
   * @since 1.0.0
   */
  public has(flag: string): boolean {
    const _flag = this._data[flag];
    return typeof _flag !== undefined && _flag !== null;
  }
}