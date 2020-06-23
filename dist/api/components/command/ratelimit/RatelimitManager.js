"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatelimitManager = void 0;
const Storage_1 = require("../../../../utils/Storage");
const Ratelimit_1 = require("./Ratelimit");
class RatelimitManager extends Storage_1.Storage {
    /**
     * @param bucket The amount of times a RateLimit can drip before it's limited
     * @param cooldown The amount of milliseconds for the ratelimits from this manager to expire
     */
    constructor(bucket, cooldown) {
        super();
        Object.defineProperty(this, 'sweepInterval', { value: null, writable: true });
        Object.defineProperty(this, '_bucket', { value: bucket, writable: true });
        Object.defineProperty(this, '_cooldown', { value: cooldown, writable: true });
    }
    static get [Symbol.species]() {
        return Storage_1.Storage;
    }
    /**
     * The amount of times a RateLimit from this manager can drip before it's limited
     * @since 1.0.0
     */
    get bucket() {
        return this._bucket;
    }
    /**
     * @since 1.0.0
     * @param value
     */
    set bucket(value) {
        for (const ratelimit of this.values())
            ratelimit.bucket = value;
        this._bucket = value;
    }
    /**
     * The amount of milliseconds for the ratelimits from this manager to expire
     * @since 1.0.0
     */
    get cooldown() {
        return this._cooldown;
    }
    /**
     * @since 1.0.0
     * @param value
     */
    set cooldown(value) {
        for (const ratelimit of this.values())
            ratelimit.cooldown = value;
        this._cooldown = value;
    }
    /**
     * Gets a RateLimit from this manager or creates it if it does not exist
     * @param id The id for the RateLimit
     * @since 1.0.0
     */
    acquire(id) {
        return this.get(id) || this.create(id);
    }
    /**
     * Creates a RateLimit for this manager
     * @param id The id the RateLimit belongs to
     * @since 1.0.0
     */
    create(id) {
        const ratelimit = new Ratelimit_1.Ratelimit(this._bucket, this._cooldown);
        this.set(id, ratelimit);
        return ratelimit;
    }
    /**
     * Wraps Collection's set method to set interval to sweep inactive RateLimits
     * @param id The id the RateLimit belongs to
     * @param ratelimit The RateLimit to set
     * @since 1.0.0
     */
    set(id, ratelimit) {
        if (!(ratelimit instanceof Ratelimit_1.Ratelimit))
            throw new Error('Invalid RateLimit');
        if (!this.sweepInterval)
            this.sweepInterval = setInterval(this.sweep.bind(this), 30000);
        return super.set(id, ratelimit);
    }
    /**
     * Wraps Collection's sweep method to clear the interval when this manager is empty
     * @param fn The filter function
     * @param thisArg The this for the sweep
     * @since 1.0.0
     */
    sweep(fn = (rl) => rl.expired, thisArg) {
        const amount = super.sweep(fn, thisArg);
        if (this.size === 0) {
            clearInterval(this.sweepInterval);
            this.sweepInterval = null;
        }
        return amount;
    }
}
exports.RatelimitManager = RatelimitManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF0ZWxpbWl0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL3JhdGVsaW1pdC9SYXRlbGltaXRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUFvRDtBQUNwRCwyQ0FBd0M7QUFFeEMsTUFBYSxnQkFBNkIsU0FBUSxpQkFBcUI7SUFHckU7OztPQUdHO0lBQ0gsWUFBbUIsTUFBYyxFQUFFLFFBQWdCO1FBQ2pELEtBQUssRUFBRSxDQUFDO1FBRVIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVNLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDaEMsT0FBTyxpQkFBTyxDQUFDO0lBQ2pCLENBQUM7SUFPRDs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsTUFBTSxDQUFDLEtBQWE7UUFDN0IsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQU9EOzs7T0FHRztJQUNILElBQVcsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsUUFBUSxDQUFDLEtBQWE7UUFDL0IsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsU0FBUyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDbEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxPQUFPLENBQUMsRUFBSztRQUNsQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxFQUFLO1FBQ2pCLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN4QixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxHQUFHLENBQUMsRUFBSyxFQUFFLFNBQW9CO1FBQ3BDLElBQUksQ0FBQyxDQUFDLFNBQVMsWUFBWSxxQkFBUyxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hGLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLEtBQThELENBQUMsRUFBRSxFQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQWE7UUFDbkgsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNuQixhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzNCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBL0dELDRDQStHQyJ9