import { EmbedOptions } from "eris";
export interface Embed {
    title?: string;
    description?: string;
    image?: EmbedImage;
    author?: EmbedAuthor;
    thumbnail?: EmbedThumbnail;
    fields?: EmbedField[];
    timestamp?: Date;
    footer?: EmbedFooter;
    color?: number;
    type?: "rich";
    url?: string;
}
export interface EmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
}
export interface EmbedThumbnail {
    url?: string;
}
export interface EmbedImage {
    url?: string;
}
export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}
export interface EmbedFooter {
    text: string;
    icon_url?: string;
}
export declare class EmbedBuilder {
    private _title;
    private _description;
    private _author;
    private _thumbnail;
    private _image;
    private _footer;
    private _color;
    private _timestamp;
    private _url;
    private readonly _fields;
    constructor(data?: Embed);
    static get default(): EmbedBuilder;
    color(color: number): EmbedBuilder;
    title(title: string): EmbedBuilder;
    description(text: string): EmbedBuilder;
    author(name: string, url?: string, iconURL?: string): EmbedBuilder;
    thumbnail(url: string): EmbedBuilder;
    field(name: string, value: string, inline?: boolean): EmbedBuilder;
    image(url: string): EmbedBuilder;
    timestamp(t?: Date): EmbedBuilder;
    footer(txt: string, iconURL?: string): EmbedBuilder;
    url(url: string): EmbedBuilder;
    build(): EmbedOptions;
}
