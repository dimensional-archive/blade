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
exports.default = Permissions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvUGVybWlzc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILCtCQUF5RTtBQUV6RSxNQUFNLGVBQWUsR0FBRztJQUN0QixxQkFBcUIsRUFBRSx1QkFBdUI7SUFDOUMsYUFBYSxFQUFFLGNBQWM7SUFDN0IsWUFBWSxFQUFFLGFBQWE7SUFDM0IsZUFBZSxFQUFFLGVBQWU7SUFDaEMsZ0JBQWdCLEVBQUUsaUJBQWlCO0lBQ25DLGFBQWEsRUFBRSxlQUFlO0lBQzlCLGNBQWMsRUFBRSxlQUFlO0lBQy9CLGVBQWUsRUFBRSxpQkFBaUI7SUFDbEMsc0JBQXNCLEVBQUUsd0JBQXdCO0lBQ2hELFFBQVEsRUFBRSxTQUFTO0lBQ25CLGNBQWMsRUFBRSxlQUFlO0lBQy9CLGNBQWMsRUFBRSxlQUFlO0lBQy9CLGlCQUFpQixFQUFFLDhCQUE4QjtJQUNqRCxnQkFBZ0IsRUFBRSxpQkFBaUI7SUFDbkMsWUFBWSxFQUFFLGFBQWE7SUFDM0IsYUFBYSxFQUFFLGNBQWM7SUFDN0Isb0JBQW9CLEVBQUUsc0JBQXNCO0lBQzVDLGlCQUFpQixFQUFFLGtCQUFrQjtJQUNyQyxnQkFBZ0IsRUFBRSxpQkFBaUI7SUFDbkMsb0JBQW9CLEVBQUUsc0JBQXNCO0lBQzVDLGNBQWMsRUFBRSw0QkFBNEI7SUFDNUMsWUFBWSxFQUFFLDBCQUEwQjtJQUN4QyxrQkFBa0IsRUFBRSxpQ0FBaUM7SUFDckQsb0JBQW9CLEVBQUUsbUNBQW1DO0lBQ3pELGFBQWEsRUFBRSwyQkFBMkI7SUFDMUMsZ0JBQWdCLEVBQUUsaUJBQWlCO0lBQ25DLGlCQUFpQixFQUFFLHNCQUFzQjtJQUN6QyxhQUFhLEVBQUUsY0FBYztJQUM3QixnQkFBZ0IsRUFBRSxpQkFBaUI7SUFDbkMsY0FBYyxFQUFFLGVBQWU7SUFDL0IsS0FBSyxFQUFFLGlCQUFpQjtJQUN4QixVQUFVLEVBQUUs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