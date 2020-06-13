import { EmbedOptions, Message, MessageContent, MessageFile, TextableChannel } from "eris";
import { Context } from "./Context";
import { EmbedBuilder } from "../../..";
export declare class ReplyBuilder {
    readonly ctx: Context;
    private _embed?;
    private _content?;
    private _tts;
    private readonly _files;
    constructor(ctx: Context);
    content(str: string): ReplyBuilder;
    tts(value: boolean): ReplyBuilder;
    file(file: MessageFile): ReplyBuilder;
    embed(embed: EmbedOptions | EmbedBuilder | ((builder: EmbedBuilder, ctx: Context) => EmbedBuilder)): ReplyBuilder;
    display(tc: TextableChannel): Promise<Message>;
    build(): [MessageContent, MessageFile[]];
}
