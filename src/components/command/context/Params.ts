export class Params {
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
   * Get an argument.
   * @param parameter
   */
  public get<T>(parameter: string): T {
    return this._data[parameter] as T;
  }

  /**
   * Set a parameters value.
   * @param parameter
   * @param value
   */
  public set(parameter: string, value: unknown): Params {
    this._data[parameter] = value;
    return this;
  }
}