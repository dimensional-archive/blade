/**
 * A ratelimit class.
 * @since 1.0.0
 */
export declare class Ratelimit {
    /**
     * The number of requests before this is limited
     * @since 1.0.0
     */
    bucket: number;
    /**
     * The amount of milliseconds for the ratelimit to expire
     * @since 1.0.0
     */
    cooldown: number;
    /**
     * The remaining times this RateLimit can be dripped before the RateLimit bucket is empty
     * @since 1.0.0
     */
    private remaining;
    /**
     * When this RateLimit is reset back to a full state
     * @since 1.0.0
     */
    private time;
    /**
     * @param bucket The number of requests before this is limited
     * @param cooldown The amount of milliseconds for this ratelimit to expire
     * @since 1.0.0
     */
    constructor(bucket: number, cooldown: number);
    /**
     * Whether this RateLimit is expired or not, allowing the bucket to be reset
     */
    get expired(): boolean;
    /**
     * Whether this RateLimit is limited or not
     */
    get limited(): boolean;
    /**
     * The remaining time in milliseconds before this RateLimit instance is reset
     */
    get remainingTime(): number;
    /**
     * Drips the RateLimit bucket
     * @since 1.0.0
     */
    drip(): this;
    /**
     * Resets the RateLimit back to it's full state
     * @since 1.0.0
     */
    reset(): this;
    /**
     * Resets the RateLimit's remaining uses back to full state
     * @since 1.0.0
     */
    resetRemaining(): this;
    /**
     * Resets the RateLimit's reset time back to full state
     * @since 1.0.0
     */
    resetTime(): this;
}
