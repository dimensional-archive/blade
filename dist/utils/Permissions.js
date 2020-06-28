"use strict";
/**
 * Credit goes to: https://github.com/NinoDiscord/Nino/blob/edge/src/util/PermissionUtils.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("@kyu/eris");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvUGVybWlzc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILG9DQUE4RTtBQUU5RSxNQUFNLGVBQWUsR0FBRztJQUN0QixtQkFBbUIsRUFBRSx1QkFBdUI7SUFDNUMsV0FBVyxFQUFFLGNBQWM7SUFDM0IsVUFBVSxFQUFFLGFBQWE7SUFDekIsYUFBYSxFQUFFLGVBQWU7SUFDOUIsY0FBYyxFQUFFLGlCQUFpQjtJQUNqQyxXQUFXLEVBQUUsZUFBZTtJQUM1QixZQUFZLEVBQUUsZUFBZTtJQUM3QixhQUFhLEVBQUUsaUJBQWlCO0lBQ2hDLG9CQUFvQixFQUFFLHdCQUF3QjtJQUM5QyxNQUFNLEVBQUUsU0FBUztJQUNqQixZQUFZLEVBQUUsZUFBZTtJQUM3QixZQUFZLEVBQUUsZUFBZTtJQUM3QixlQUFlLEVBQUUsOEJBQThCO0lBQy9DLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsVUFBVSxFQUFFLGFBQWE7SUFDekIsV0FBVyxFQUFFLGNBQWM7SUFDM0Isa0JBQWtCLEVBQUUsc0JBQXNCO0lBQzFDLGVBQWUsRUFBRSxrQkFBa0I7SUFDbkMsY0FBYyxFQUFFLGlCQUFpQjtJQUNqQyxrQkFBa0IsRUFBRSxzQkFBc0I7SUFDMUMsWUFBWSxFQUFFLDRCQUE0QjtJQUMxQyxVQUFVLEVBQUUsMEJBQTBCO0lBQ3RDLGdCQUFnQixFQUFFLGlDQUFpQztJQUNuRCxrQkFBa0IsRUFBRSxtQ0FBbUM7SUFDdkQsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxjQUFjLEVBQUUsaUJBQWlCO0lBQ2pDLGVBQWUsRUFBRSxzQkFBc0I7SUFDdkMsV0FBVyxFQUFFLGNBQWM7SUFDM0IsY0FBYyxFQUFFLGlCQUFpQjtJQUNqQyxZQUFZLEVBQUUsZUFBZTtJQUM3QixHQUFHLEVBQUUsaUJBQWlCO0lBQ3RCLFFBQVEsRUFBRSx1QkFBdUI7SUFDakMsT0FB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