/**
 * Credit goes to: https://github.com/NinoDiscord/Nino/blob/edge/src/util/PermissionUtils.ts
 */
import { GuildChannel, Member, Role } from 'eris';
/**
 * Contains utility functions to help with permission checking and hierarchy.
 * @since 1.0.0
 */
export default class Permissions {
    /**
     * Returns the highest role the member has
     * undefined if the member doesn't have a role
     * @param member the member
     */
    static topRole(member: Member): Role | undefined;
    /**
     * Returns true if a is above b in the hierarchy, otherwise false.
     */
    static above(a: Member, b: Member): boolean;
    /**
     * Calculates permissions of a role in a channel.
     * @param role The role to calculate the permissions of.
     * @param channel The channel to use.
     * @since 1.0.0
     */
    static permissionsOf(role: Role, channel: GuildChannel): number;
    /**
     * Shows a string representation of all of the permissions
     * @param permission The permissions bit-field.
     * @since 1.0.0
     */
    static toString(permission: number): string;
    /**
     * Returns whether the permission the user has overlap the permissions required
     * @param user The permission the user has
     * @param required The permissions required
     * @since 1.0.0
     */
    static overlaps(user: number, required: number): boolean;
    static add(...a: number[]): number;
}
