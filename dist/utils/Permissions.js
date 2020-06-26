"use strict";
/**
 * Credit goes to: https://github.com/NinoDiscord/Nino/blob/edge/src/util/PermissionUtils.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const PermissionNames = {
    'createInstantInvite': 'Create Instant Invite',
    'kickMembers': 'Kick Members',
    'banMembers': 'Ban Members',
    'administrator': 'Administrator',
    'manageChannels': 'Manage Channels',
    'manageGuild': 'Manage Server',
    'addReactions': 'Add Reactions',
    'viewAuditLogs': 'View Audit Logs',
    'voicePrioritySpeaker': 'Voice Priority Speaker',
    'stream': 'Go Live',
    'readMessages': 'Read Messages',
    'sendMessages': 'Send Messages',
    'sendTTSMessages': 'Send Text to Speech Messages',
    'manageMessages': 'Manage Messages',
    'embedLinks': 'Embed Links',
    'attachFiles': 'Attach Files',
    'readMessageHistory': 'Read Message History',
    'mentionEveryone': 'Mention Everyone',
    'externalEmojis': 'External Emojis',
    'viewGuildAnalytics': 'View Guild Analytics',
    'voiceConnect': 'Connect to a Voice Channel',
    'voiceSpeak': 'Speak in a Voice Channel',
    'voiceMuteMembers': 'Mute Members in a Voice Channel',
    'voiceDeafenMembers': 'Deafen Members in a Voice Channel',
    'voiceUseVAD': 'Uses VAD in Voice Channel',
    'changeNickname': 'Change Nickname',
    'manageNicknames': 'Manage All Nicknames',
    'manageRoles': 'Manage Roles',
    'manageWebhooks': 'Manage Webhooks',
    'manageEmojis': 'Manage Emojis',
    'all': 'All Permissions',
    'allGuild': 'All Guild Permissions',
    'allText': 'All Text Channel Permissions',
    'allVoice': 'All Voice Channel Permissions'
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
            .map(r => member.guild.roles.get(r))
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
            .filter(r => r.position <= role.position)
            .map(r => r.id);
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
        const perms = Object.keys(perm).map(p => PermissionNames[p]);
        return perms.join(', ');
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
        return a.reduce((a, n) => a |= n, 0);
    }
}
exports.Permissions = Permissions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvUGVybWlzc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILCtCQUF5RTtBQUV6RSxNQUFNLGVBQWUsR0FBRztJQUN0QixxQkFBcUIsRUFBRSx1QkFBdUI7SUFDOUMsYUFBYSxFQUFFLGNBQWM7SUFDN0IsWUFBWSxFQUFFLGFBQWE7SUFDM0IsZUFBZSxFQUFFLGVBQWU7SUFDaEMsZ0JBQWdCLEVBQUUsaUJBQWlCO0lBQ25DLGFBQWEsRUFBRSxlQUFlO0lBQzlCLGNBQWMsRUFBRSxlQUFlO0lBQy9CLGVBQWUsRUFBRSxpQkFBaUI7SUFDbEMsc0JBQXNCLEVBQUUsd0JBQXdCO0lBQ2hELFFBQVEsRUFBRSxTQUFTO0lBQ25CLGNBQWMsRUFBRSxlQUFlO0lBQy9CLGNBQWMsRUFBRSxlQUFlO0lBQy9CLGlCQUFpQixFQUFFLDhCQUE4QjtJQUNqRCxnQkFBZ0IsRUFBRSxpQkFBaUI7SUFDbkMsWUFBWSxFQUFFLGFBQWE7SUFDM0IsYUFBYSxFQUFFLGNBQWM7SUFDN0Isb0JBQW9CLEVBQUUsc0JBQXNCO0lBQzVDLGlCQUFpQixFQUFFLGtCQUFrQjtJQUNyQyxnQkFBZ0IsRUFBRSxpQkFBaUI7SUFDbkMsb0JBQW9CLEVBQUUsc0JBQXNCO0lBQzVDLGNBQWMsRUFBRSw0QkFBNEI7SUFDNUMsWUFBWSxFQUFFLDBCQUEwQjtJQUN4QyxrQkFBa0IsRUFBRSxpQ0FBaUM7SUFDckQsb0JBQW9CLEVBQUUsbUNBQW1DO0lBQ3pELGFBQWEsRUFBRSwyQkFBMkI7SUFDMUMsZ0JBQWdCLEVBQUUsaUJBQWlCO0lBQ25DLGlCQUFpQixFQUFFLHNCQUFzQjtJQUN6QyxhQUFhLEVBQUUsY0FBYztJQUM3QixnQkFBZ0IsRUFBRSxpQkFBaUI7SUFDbkMsY0FBYyxFQUFFLGVBQWU7SUFDL0IsS0FBSyxFQUFFLGlCQUFpQjtJQUN4QixVQUFVLEVBQUUs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