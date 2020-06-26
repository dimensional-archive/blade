"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const __1 = require("../../..");
const Components_1 = require("../../Components");
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
        const Builder = Components_1.Components.get("replyBuilder");
        if (typeof message === "function") {
            const builder = await message(new Builder(context), context);
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
    /**
     * Get a translation string.
     * @param path The translation to get.
     * @param data
     * @since 1.0.5
     */
    t(path, data = {}) {
        const lang = this.store.handling.getLanguage(this);
        return typeof lang !== "string"
            ? lang.translate(path, data)
            : this.client.languages.translate(lang, path, data);
    }
}
exports.Context = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL0NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwrQkFBa0Q7QUFJbEQsZ0NBQXdDO0FBQ3hDLGlEQUE4QztBQWU5QyxNQUFhLE9BQU87SUFjbEIsWUFBbUIsS0FBbUIsRUFBRSxPQUFnQjtRQUZqRCxhQUFRLEdBQWdDLElBQUksQ0FBQztRQUdsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWE7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLFlBQVksa0JBQVc7WUFDaEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDNUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSztZQUNmLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDeEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNo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O0lBQ0ksVUFBVSxDQUFDLE9BQTRCO1FBQzVDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3JDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDMUIsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxRQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN6QztTQUNGO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxlQUFlLENBQUMsT0FBNEI7UUFDakQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztTQUM3QjtRQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFdBQVcsQ0FBQyxLQUFjO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksQ0FBQyxDQUFhLElBQVksRUFBRSxPQUE0QixFQUFFO1FBQy9ELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRCxPQUFPLE9BQU8sSUFBSSxLQUFLLFFBQVE7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNGO0FBekxELDBCQXlMQyJ9