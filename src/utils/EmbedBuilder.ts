import { EmbedOptions } from "@kyu/eris";

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

type StringResolvable = string | string[];

function toString(str: StringResolvable): string {
  if (str instanceof Array) return str.join("\n'");
  if (typeof str === "string") return str;
  return String(str);
}

function clone(obj: object) {
  const object = Object.create(obj);
  return Object.assign(obj, object);
}

export class EmbedBuilder {
  private _title: string | undefined;
  private _description: string | undefined;
  private _author: EmbedAuthor | undefined;
  private _thumbnail: EmbedThumbnail | undefined;
  private _image: EmbedImage | undefined;
  private _footer: EmbedFooter | undefined;
  private _color: number | undefined;
  private _timestamp: Date | undefined;
  private _url: string | undefined;
  private readonly _fields: EmbedField[] | undefined;

  public constructor(data: Embed = {}) {
    this._title = data.title;
    this._description = data.description;
    this._author = data.author;
    this._thumbnail = data.thumbnail;
    this._image = data.image;
    this._footer = data.footer;
    this._color = data.color;
    this._fields = data.fields ? data.fields.map(clone) : [];
    this._timestamp = data.timestamp;
    this._url = data.url;
  }

  public static get default(): EmbedBuilder {
    return new EmbedBuilder()
      .color(0xc4549c)
  }

  public color(color: number): EmbedBuilder {
    this._color = color;
    return this;
  }

  public title(title: string): EmbedBuilder {
    this._title = title;
    return this;
  }

  public description(text: string): EmbedBuilder {
    this._description = toString(text);
    return this;
  }

  public author(name: string, url?: string, iconURL?: string): EmbedBuilder {
    this._author = {
      name,
      url,
      icon_url: iconURL,
    };

    return this;
  }

  public thumbnail(url: string): EmbedBuilder {
    this._thumbnail = { url };
    return this;
  }

  public field(name: string, value: string, inline = false): EmbedBuilder {
    if (!name)
      throw new Error("You didn't set a name to the field.");
    if (!value)
      throw new Error("You didn't set a value to the field.");
    if (this._fields!.length > 25)
      throw new Error("Unable to add anymore fields. (FIELD_LIMIT_THRESHOLD)");

    this._fields!.push({ name, value: toString(value), inline });
    return this;
  }

  public image(url: string): EmbedBuilder {
    this._image = { url };
    return this;
  }

  public timestamp(t: Date = new Date()): EmbedBuilder {
    this._timestamp = t;
    return this;
  }

  public footer(txt: string, iconURL?: string): EmbedBuilder {
    this._footer = { text: txt, icon_url: iconURL };
    return this;
  }

  public url(url: string): EmbedBuilder {
    this._url = url;
    return this;
  }

  public build(): EmbedOptions {
    return {
      title: this._title,
      description: this._description,
      fields: this._fields,
      author: this._author
        ? {
          name: this._author.name,
          url: this._author.url,
          icon_url: this._author.icon_url
        }
        : undefined,
      image: this._image ? this._image : undefined,
      thumbnail: this._thumbnail,
      footer: this._footer
        ? {
          text: this._footer.text,
          icon_url: this._footer.icon_url
        }
        : undefined,
      color: this._color,
      url: this._url ? this._url : undefined,
      timestamp: this._timestamp ? this._timestamp.toISOString() : undefined,
    };
  }
}