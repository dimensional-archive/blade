import { Storage } from "../../../../utils/Storage";
import { Ratelimit } from "./Ratelimit";
export declare class RatelimitManager<K = string> extends Storage<K, Ratelimit> {
    private sweepInterval;
    /**
     * @param bucket The amount of times a RateLimit can drip before it's limited
     * @param cooldown The amount of milliseconds for the ratelimits from this manager to expire
     */
    constructor(bucket: number, cooldown: number);
    static get [Symbol.species](): typeof Storage;
    /**
     * The amount of times a RateLimit from this manager can drip before it's limited
     */
    private _bucket;
    /**
     * The amount of times a RateLimit from this manager can drip before it's limited
     * @since 1.0.0
     */
    get bucket(): number;
    /**
     * @since 1.0.0
     * @param value
     */
    set bucket(value: number);
    /**
     * The amount of milliseconds for the ratelimits from this manager to expire
     */
    private _cooldown;
    /**
     * The amount of milliseconds for the ratelimits from this manager to expire
     * @since 1.0.0
     */
    get cooldown(): number;
    /**
     * @since 1.0.0
     * @param value
     */
    set cooldown(value: number);
    /**
     * Gets a RateLimit from this manager or creates it if it does not exist
     * @param id The id for the RateLimit
     * @since 1.0.0
     */
    acquire(id: K): Ratelimit;
    /**
     * Creates a RateLimit for this manager
     * @param id The id the RateLimit belongs to
     * @since 1.0.0
     */
    create(id: K): Ratelimit;
    /**
     * Wraps Collection's set method to set interval to sweep inactive RateLimits
     * @param id The id the RateLimit belongs to
     * @param ratelimit The RateLimit to set
     * @since 1.0.0
     */
    set(id: K, ratelimit: Ratelimit): this;
    /**
     * Wraps Collection's sweep method to clear the interval when this manager is empty
     * @param fn The filter function
     * @param thisArg The this for the sweep
     * @since 1.0.0
     */
    sweep(fn?: (value: Ratelimit, key: K, collection: this) => boolean, thisArg?: any): number;
}
