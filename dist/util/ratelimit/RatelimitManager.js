"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ratelimit_1 = require("./Ratelimit");
const Storage_1 = require("../Storage");
class RatelimitManager extends Storage_1.Collection {
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
        return Storage_1.Collection;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF0ZWxpbWl0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL3JhdGVsaW1pdC9SYXRlbGltaXRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXdDO0FBQ3hDLHdDQUF3QztBQUV4QyxNQUFhLGdCQUE2QixTQUFRLG9CQUF3QjtJQUd4RTs7O09BR0c7SUFDSCxZQUFtQixNQUFjLEVBQUUsUUFBZ0I7UUFDakQsS0FBSyxFQUFFLENBQUM7UUFFUixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRU0sTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNoQyxPQUFPLG9CQUFVLENBQUM7SUFDcEIsQ0FBQztJQU9EOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxNQUFNLENBQUMsS0FBYTtRQUM3QixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBT0Q7OztPQUdHO0lBQ0gsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxRQUFRLENBQUMsS0FBYTtRQUMvQixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFBRSxTQUFTLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNsRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE9BQU8sQ0FBQyxFQUFLO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEVBQUs7UUFDakIsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxFQUFLLEVBQUUsU0FBb0I7UUFDcEMsSUFBSSxDQUFDLENBQUMsU0FBUyxZQUFZLHFCQUFTLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO1lBQUUsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEYsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsS0FBOEQsQ0FBQyxFQUFFLEVBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBYTtRQUNuSCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ25CLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUEvR0QsNENBK0dDIn0=