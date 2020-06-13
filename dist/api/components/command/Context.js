"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const ReplyBuilder_1 = require("./ReplyBuilder");
const eris_1 = require("eris");
class Context {
    constructor(store, message) {
        this.messages = null;
        this.store = store;
        this.client = store.client;
        this.message = message;
        this.shouldEdit = false;
        if (store.handling.storeMessages)
            this.messages = new Map();
    }
    /**
     * Returns the guild in which this message was sent in.
     * @since 1.0.0
     */
    get guild() {
        return this.message.channel instanceof eris_1.TextChannel
            ? this.message.channel.guild
            : undefined;
    }
    /**
     * Returns the author of the message.
     * @since 1.0.0
     */
    get author() {
        return this.message.author;
    }
    /**
     * Returns the member who sent the message if any.
     * @since 1.0.0
     */
    get member() {
        return this.guild
            ? this.guild.members.get(this.author.id)
            : undefined;
    }
    /**
     * Returns the channel this message was sent in.
     * @since 1.0.0
     */
    get channel() {
        return this.message.channel;
    }
    /**
     * Returns the client as a guild member.
     * @since 1.0.0
     */
    get me() {
        return this.guild.members.get(this.client.user.id);
    }
    /**
     * Transforms any reply builders.
     * @since 1.0.0
     */
    static async getTransformed(context, message, files = []) {
        let transformedOptions;
        if (typeof message === "function") {
            const builder = await message(new ReplyBuilder_1.ReplyBuilder(context), context);
            transformedOptions = await builder.build();
        }
        else
            transformedOptions = [message, files];
        return transformedOptions;
    }
    /**
     * Sends a response or edits an old response if available.
     * @param content The content of the response.
     * @param files Any files to send along with the response.
     * @since 1.0.0
     */
    async reply(content, files = []) {
        const transformed = await Context.getTransformed(this, content, files);
        if (this.shouldEdit && (this.command ? this.command.editable : true) && !this.lastResponse.attachments.length) {
            return this.lastResponse.edit(transformed[0]);
        }
        const sent = await this.message.channel.createMessage(transformed[0], transformed[1]);
        const lastSent = this.setLastResponse(sent);
        this.setEditable(!lastSent.attachments.length);
        return sent;
    }
    /**
     * Sends a response, overwriting the last response.
     * @param content The content to send.
     * @param files Any files to send.
     * @since 1.0.0
     */
    async sendNew(content, files = []) {
        const sent = await this.message.channel.createMessage(...await Context.getTransformed(this, content, files));
        const lastSent = this.setLastResponse(sent);
        this.setEditable(!lastSent.attachments.length);
        return sent;
    }
    /**
     * Edits the last response.
     * @param content Edit content.
     * @since 1.0.0
     */
    async edit(content) {
        const [editContent] = await Context.getTransformed(this, content);
        return this.lastResponse.edit(editContent);
    }
    /**
     * Adds client prompt or user reply to messages.
     * @param message Message(s) to add.
     */
    addMessage(message) {
        if (this.store.handling.storeMessages) {
            if (Array.isArray(message)) {
                for (const msg of message) {
                    this.messages.set(msg.id, msg);
                }
            }
            else {
                this.messages.set(message.id, message);
            }
        }
        return message;
    }
    /**
     * Sets the last response.
     * @param message Response to set.
     * @since 1.0.0
     */
    setLastResponse(message) {
        if (Array.isArray(message)) {
            this.lastResponse = message.slice(-1)[0];
        }
        else {
            this.lastResponse = message;
        }
        return this.lastResponse;
    }
    /**
     * Changes if the message should be edited.
     * @param state Whether the message should be editable or not.
     * @since 1.0.0
     */
    setEditable(state) {
        this.shouldEdit = Boolean(state);
        return this;
    }
}
exports.Context = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL0NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQThDO0FBRzlDLCtCQUFrRDtBQWVsRCxNQUFhLE9BQU87SUFjbEIsWUFBbUIsS0FBbUIsRUFBRSxPQUFnQjtRQUZqRCxhQUFRLEdBQWdDLElBQUksQ0FBQztRQUdsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWE7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLFlBQVksa0JBQVc7WUFDaEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDNUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSztZQUNmLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDeEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNoQixDQUFDO0lBRUQ7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