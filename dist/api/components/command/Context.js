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
            return this.lastResponse.edit(transformed);
        }
        const sent = await this.message.channel.createMessage(transformed);
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