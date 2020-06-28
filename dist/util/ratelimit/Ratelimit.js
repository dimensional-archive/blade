"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A ratelimit class.
 * @since 1.0.0
 */
class Ratelimit {
    /**
     * @param bucket The number of requests before this is limited
     * @param cooldown The amount of milliseconds for this ratelimit to expire
     * @since 1.0.0
     */
    constructor(bucket, cooldown) {
        this.bucket = bucket;
        this.cooldown = cooldown;
        this.reset();
    }
    /**
     * Whether this RateLimit is expired or not, allowing the bucket to be reset
     */
    get expired() {
        return this.remainingTime === 0;
    }
    /**
     * Whether this RateLimit is limited or not
     */
    get limited() {
        return !(this.remaining > 0 || this.expired);
    }
    /**
     * The remaining time in milliseconds before this RateLimit instance is reset
     */
    get remainingTime() {
        return Math.max(this.time - Date.now(), 0);
    }
    /**
     * Drips the RateLimit bucket
     * @since 1.0.0
     */
    drip() {
        if (this.limited)
            throw new Error('Ratelimited');
        if (this.expired)
            this.reset();
        this.remaining--;
        return this;
    }
    /**
     * Resets the RateLimit back to it's full state
     * @since 1.0.0
     */
    reset() {
        return this.resetRemaining().resetTime();
    }
    /**
     * Resets the RateLimit's remaining uses back to full state
     * @since 1.0.0
     */
    resetRemaining() {
        this.remaining = this.bucket;
        return this;
    }
    /**
     * Resets the RateLimit's reset time back to full state
     * @since 1.0.0
     */
    resetTime() {
        this.time = Date.now() + this.cooldown;
        return this;
    }
}
exports.Ratelimit = Ratelimit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF0ZWxpbWl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvcmF0ZWxpbWl0L1JhdGVsaW1pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILE1BQWEsU0FBUztJQXVCcEI7Ozs7T0FJRztJQUNILFlBQW1CLE1BQWMsRUFBRSxRQUFnQjtRQUNqRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLE9BQU87UUFDaEIsT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLE9BQU87UUFDaEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsYUFBYTtRQUN0QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLElBQUk7UUFDVCxJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLO1FBQ1YsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGNBQWM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFNBQVM7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUVGO0FBN0ZELDhCQTZGQyJ9