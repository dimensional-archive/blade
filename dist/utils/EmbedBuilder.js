"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toString(str) {
    if (str instanceof Array)
        return str.join("\n'");
    if (typeof str === "string")
        return str;
    return String(str);
}
function clone(obj) {
    const object = Object.create(obj);
    return Object.assign(obj, object);
}
class EmbedBuilder {
    constructor(data = {}) {
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
    static get default() {
        return new EmbedBuilder()
            .color(0xc4549c);
    }
    color(color) {
        this._color = color;
        return this;
    }
    title(title) {
        this._title = title;
        return this;
    }
    description(text) {
        this._description = toString(text);
        return this;
    }
    author(name, url, iconURL) {
        this._author = {
            name,
            url,
            icon_url: iconURL,
        };
        return this;
    }
    thumbnail(url) {
        this._thumbnail = { url };
        return this;
    }
    field(name, value, inline = false) {
        if (!name)
            throw new Error("You didn't set a name to the field.");
        if (!value)
            throw new Error("You didn't set a value to the field.");
        if (this._fields.length > 25)
            throw new Error("Unable to add anymore fields. (FIELD_LIMIT_THRESHOLD)");
        this._fields.push({ name, value: toString(value), inline });
        return this;
    }
    image(url) {
        this._image = { url };
        return this;
    }
    timestamp(t = new Date()) {
        this._timestamp = t;
        return this;
    }
    footer(txt, iconURL) {
        this._footer = { text: txt, icon_url: iconURL };
        return this;
    }
    url(url) {
        this._url = url;
        return this;
    }
    build() {
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
exports.EmbedBuilder = EmbedBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1iZWRCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0VtYmVkQnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTJDQSxTQUFTLFFBQVEsQ0FBQyxHQUFxQjtJQUNyQyxJQUFJLEdBQUcsWUFBWSxLQUFLO1FBQUUsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pELElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtRQUFFLE9BQU8sR0FBRyxDQUFDO0lBQ3hDLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxHQUFXO0lBQ3hCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsTUFBYSxZQUFZO0lBWXZCLFlBQW1CLE9BQWMsRUFBRTtRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxD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