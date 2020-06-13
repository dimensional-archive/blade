import { Storage } from "../../../../utils/Storage";
import { Ratelimit } from "./Ratelimit";

export class RatelimitManager<K = string> extends Storage<K, Ratelimit> {
  private sweepInterval!: NodeJS.Timer | null;

  /**
   * @param bucket The amount of times a RateLimit can drip before it's limited
   * @param cooldown The amount of milliseconds for the ratelimits from this manager to expire
   */
  public constructor(bucket: number, cooldown: number) {
    super();

    Object.defineProperty(this, 'sweepInterval', { value: null, writable: true });
    Object.defineProperty(this, '_bucket', { value: bucket, writable: true });
    Object.defineProperty(this, '_cooldown', { value: cooldown, writable: true });
  }

  public static get [Symbol.species](): typeof Storage {
    return Storage;
  }

  /**
   * The amount of times a RateLimit from this manager can drip before it's limited
   */
  private _bucket!: number;

  /**
   * The amount of times a RateLimit from this manager can drip before it's limited
   * @since 1.0.0
   */
  public get bucket(): number {
    return this._bucket;
  }

  /**
   * @since 1.0.0
   * @param value
   */
  public set bucket(value: number) {
    for (const ratelimit of this.values()) ratelimit.bucket = value;
    this._bucket = value;
  }

  /**
   * The amount of milliseconds for the ratelimits from this manager to expire
   */
  private _cooldown!: number;

  /**
   * The amount of milliseconds for the ratelimits from this manager to expire
   * @since 1.0.0
   */
  public get cooldown(): number {
    return this._cooldown;
  }

  /**
   * @since 1.0.0
   * @param value
   */
  public set cooldown(value: number) {
    for (const ratelimit of this.values()) ratelimit.cooldown = value;
    this._cooldown = value;
  }

  /**
   * Gets a RateLimit from this manager or creates it if it does not exist
   * @param id The id for the RateLimit
   * @since 1.0.0
   */
  public acquire(id: K): Ratelimit {
    return this.get(id) || this.create(id);
  }

  /**
   * Creates a RateLimit for this manager
   * @param id The id the RateLimit belongs to
   * @since 1.0.0
   */
  public create(id: K): Ratelimit {
    const ratelimit = new Ratelimit(this._bucket, this._cooldown);
    this.set(id, ratelimit);
    return ratelimit;
  }

  /**
   * Wraps Collection's set method to set interval to sweep inactive RateLimits
   * @param id The id the RateLimit belongs to
   * @param ratelimit The RateLimit to set
   * @since 1.0.0
   */
  public set(id: K, ratelimit: Ratelimit): this {
    if (!(ratelimit instanceof Ratelimit)) throw new Error('Invalid RateLimit');
    if (!this.sweepInterval) this.sweepInterval = setInterval(this.sweep.bind(this), 30000);
    return super.set(id, ratelimit);
  }

  /**
   * Wraps Collection's sweep method to clear the interval when this manager is empty
   * @param fn The filter function
   * @param thisArg The this for the sweep
   * @since 1.0.0
   */
  public sweep(fn: (value: Ratelimit, key: K, collection: this) => boolean = (rl): boolean => rl.expired, thisArg?: any): number {
    const amount = super.sweep(fn, thisArg);

    if (this.size === 0) {
      clearInterval(this.sweepInterval!);
      this.sweepInterval = null;
    }

    return amount;
  }
}
