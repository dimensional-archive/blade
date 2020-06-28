import { EmbedOptions, Message, MessageContent, MessageFile, TextableChannel } from "@kyu/eris";
import { Context } from "./Context";
import { EmbedBuilder } from "../../..";

export class ReplyBuilder {
  public readonly ctx: Context

  private _embed?: EmbedOptions;
  private _content?: string;
  private _tts;
  private readonly _files: MessageFile[];

  public constructor(ctx: Context) {
    this.ctx = ctx;
    this._tts = false;
    this._files = [];
  }

  public content(str: string): ReplyBuilder {
    this._content = str;
    return this;
  }

  public tts(value: boolean): ReplyBuilder {
    this._tts = value;
    return this;
  }

  public file(file: MessageFile): ReplyBuilder {
    this._files.push(file);
    return this;
  }

  public embed(embed: EmbedOptions | EmbedBuilder | ((builder: EmbedBuilder, ctx: Context) => EmbedBuilder)): ReplyBuilder {
    this._embed = typeof embed === "function"
      ? embed(new EmbedBuilder(), this.ctx).build()
      : embed instanceof EmbedBuilder
        ? embed.build()
        : embed;
    return this;
  }

  public display(tc: TextableChannel): Promise<Message> {
    return tc.createMessage({
      tts: this._tts,
      content: this._content,
      embed: this._embed,
    }, this._files);
  }

  public build(): [ MessageContent, MessageFile[] ] {
    return [ {
      tts: this._tts,
      content: this._content,
      embed: this._embed,
    }, this._files ];
  }
}