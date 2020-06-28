"use strict";
/**
 * Credit goes to: https://github.com/NinoDiscord/Nino/blob/edge/src/util/PermissionUtils.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const PermissionNames = {
    createInstantInvite: "Create Instant Invite",
    kickMembers: "Kick Members",
    banMembers: "Ban Members",
    administrator: "Administrator",
    manageChannels: "Manage Channels",
    manageGuild: "Manage Server",
    addReactions: "Add Reactions",
    viewAuditLogs: "View Audit Logs",
    voicePrioritySpeaker: "Voice Priority Speaker",
    stream: "Go Live",
    readMessages: "Read Messages",
    sendMessages: "Send Messages",
    sendTTSMessages: "Send Text to Speech Messages",
    manageMessages: "Manage Messages",
    embedLinks: "Embed Links",
    attachFiles: "Attach Files",
    readMessageHistory: "Read Message History",
    mentionEveryone: "Mention Everyone",
    externalEmojis: "External Emojis",
    viewGuildAnalytics: "View Guild Analytics",
    voiceConnect: "Connect to a Voice Channel",
    voiceSpeak: "Speak in a Voice Channel",
    voiceMuteMembers: "Mute Members in a Voice Channel",
    voiceDeafenMembers: "Deafen Members in a Voice Channel",
    voiceUseVAD: "Uses VAD in Voice Channel",
    changeNickname: "Change Nickname",
    manageNicknames: "Manage All Nicknames",
    manageRoles: "Manage Roles",
    manageWebhooks: "Manage Webhooks",
    manageEmojis: "Manage Emojis",
    all: "All Permissions",
    allGuild: "All Guild Permissions",
    allText: "All Text Channel Permissions",
    allVoice: "All Voice Channel Permissions",
};
/**
 * Contains utility functions to help with permission checking and hierarchy.
 * @since 1.0.0
 */
class Permissions {
    /**
     * Returns the highest role the member has
     * undefined if the member doesn't have a role
     * @param member the member
     */
    static topRole(member) {
        if (member === null || !member.roles.length)
            return undefined;
        return member.roles
            .map((r) => member.guild.roles.get(r))
            .sort((a, b) => b.position - a.position)[0];
    }
    /**
     * Returns true if a is above b in the hierarchy, otherwise false.
     */
    static above(a, b) {
        if (this.topRole(a) === undefined)
            return false;
        if (this.topRole(b) === undefined)
            return true;
        return this.topRole(a).position > this.topRole(b).position;
    }
    /**
     * Calculates permissions of a role in a channel.
     * @param role The role to calculate the permissions of.
     * @param channel The channel to use.
     * @since 1.0.0
     */
    static permissionsOf(role, channel) {
        let permission = role.permissions.allow;
        if (permission & eris_1.Constants.Permissions.administrator)
            return eris_1.Constants.Permissions.all;
        let overwrite = channel.permissionOverwrites.get(channel.guild.id);
        if (overwrite)
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        let deny = 0, allow = 0;
        const roles = channel.guild.roles
            .filter((r) => r.position <= role.position)
            .map((r) => r.id);
        for (const roleID of roles) {
            if ((overwrite = channel.permissionOverwrites.get(roleID))) {
                deny |= overwrite.deny;
                allow |= overwrite.allow;
            }
        }
        permission = (permission & ~deny) | allow;
        return permission;
    }
    /**
     * Shows a string representation of all of the permissions
     * @param permission The permissions bit-field.
     * @since 1.0.0
     */
    static toString(permission) {
        const perm = new eris_1.Permission(permission, 0).json;
        const perms = Object.keys(perm).map((p) => PermissionNames[p]);
        return perms.join(", ");
    }
    /**
     * Returns whether the permission the user has overlap the permissions required
     * @param user The permission the user has
     * @param required The permissions required
     * @since 1.0.0
     */
    static overlaps(user, required) {
        return ((user & 8) != 0 || (user & required) == required // The user is an admin, automatically overwrites all permissions.
        ); // user & required give all of the permissions in common, it should be required.
    }
    static add(...a) {
        return a.reduce((a, n) => (a |= n), 0);
    }
}
exports.Permissions = Permissions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC9lcmlzL1Blcm1pc3Npb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7QUFFSCwrQkFBeUU7QUFFekUsTUFBTSxlQUFlLEdBQUc7SUFDdEIsbUJBQW1CLEVBQUUsdUJBQXVCO0lBQzVDLFdBQVcsRUFBRSxjQUFjO0lBQzNCLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLGFBQWEsRUFBRSxlQUFlO0lBQzlCLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsV0FBVyxFQUFFLGVBQWU7SUFDNUIsWUFBWSxFQUFFLGVBQWU7SUFDN0IsYUFBYSxFQUFFLGlCQUFpQjtJQUNoQyxvQkFBb0IsRUFBRSx3QkFBd0I7SUFDOUMsTUFBTSxFQUFFLFNBQVM7SUFDakIsWUFBWSxFQUFFLGVBQWU7SUFDN0IsWUFBWSxFQUFFLGVBQWU7SUFDN0IsZUFBZSxFQUFFLDhCQUE4QjtJQUMvQyxjQUFjLEVBQUUsaUJBQWlCO0lBQ2pDLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLFdBQVcsRUFBRSxjQUFjO0lBQzNCLGtCQUFrQixFQUFFLHNCQUFzQjtJQUMxQyxlQUFlLEVBQUUsa0JBQWtCO0lBQ25DLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsa0JBQWtCLEVBQUUsc0JBQXNCO0lBQzFDLFlBQVksRUFBRSw0QkFBNEI7SUFDMUMsVUFBVSxFQUFFLDBCQUEwQjtJQUN0QyxnQkFBZ0IsRUFBRSxpQ0FBaUM7SUFDbkQsa0JBQWtCLEVBQUUsbUNBQW1DO0lBQ3ZELFdBQVcsRUFBRSwyQkFBMkI7SUFDeEMsY0FBYyxFQUFFLGlCQUFpQjtJQUNqQyxlQUFlLEVBQUUsc0JBQXNCO0lBQ3ZDLFdBQVcsRUFBRSxjQUFjO0lBQzNCLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsWUFBWSxFQUFFLGVBQWU7SUFDN0IsR0FBRyxFQUFFLGlCQUFpQjtJQUN0QixRQUFRLEVBQUUsdUJBQXVCO0lB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