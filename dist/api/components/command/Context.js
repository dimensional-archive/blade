"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const ReplyBuilder_1 = require("./ReplyBuilder");
const eris_1 = require("eris");
const __1 = require("../../..");
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
    static async getTransformed(context, message) {
        let transformedOptions;
        if (typeof message === "function") {
            const builder = await message(new ReplyBuilder_1.ReplyBuilder(context), context);
            transformedOptions = (await builder.build())[0];
        }
        else if (message instanceof __1.EmbedBuilder)
            transformedOptions = { embed: message.build() };
        else
            transformedOptions = message;
        return transformedOptions;
    }
    /**
     * Sends a response or edits an old response if available.
     * @param content The content of the response.
     * @since 1.0.0
     */
    async reply(content) {
        const transformed = await Context.getTransformed(this, content);
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
     * @since 1.0.0
     */
    async sendNew(content) {
        const sent = await this.message.channel.createMessage(await Context.getTransformed(this, content));
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
        const editContent = await Context.getTransformed(this, content);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL0NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQThDO0FBRzlDLCtCQUFrRDtBQUlsRCxnQ0FBd0M7QUFleEMsTUFBYSxPQUFPO0lBY2xCLFlBQW1CLEtBQW1CLEVBQUUsT0FBZ0I7UUFGakQsYUFBUSxHQUFnQyxJQUFJLENBQUM7UUFHbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzlELENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFXLEtBQUs7UUFDZCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxZQUFZLGtCQUFXO1lBQ2hELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQzVCLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUs7WUFDZixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFD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