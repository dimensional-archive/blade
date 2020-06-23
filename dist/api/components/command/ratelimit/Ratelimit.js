"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratelimit = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF0ZWxpbWl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9jb21wb25lbnRzL2NvbW1hbmQvcmF0ZWxpbWl0L1JhdGVsaW1pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7O0dBR0c7QUFDSCxNQUFhLFNBQVM7SUF1QnBCOzs7O09BSUc7SUFDSCxZQUFtQixNQUFjLEVBQUUsUUFBZ0I7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGFBQWEsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLGFBQWE7UUFDdEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxJQUFJO1FBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUUvQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSztRQUNWLE9BQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxjQUFjO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSSxTQUFTO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FFRjtBQTdGRCw4QkE2RkMifQ==