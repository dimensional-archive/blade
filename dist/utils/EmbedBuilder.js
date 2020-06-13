"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedBuilder = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1iZWRCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0VtYmVkQnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUEyQ0EsU0FBUyxRQUFRLENBQUMsR0FBcUI7SUFDckMsSUFBSSxHQUFHLFlBQVksS0FBSztRQUFFLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVE7UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUN4QyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsR0FBVztJQUN4QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELE1BQWEsWUFBWTtJQVl2QixZQUFtQixPQUFjLEVBQUU7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxNQUFNLEtBQUssT0FBTztRQUN2QixPQUFPLElBQUksWUFBWSxFQUFFO2FBQ3RCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQixDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQWE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQWE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sV0FBVyxDQUFDLElBQVk7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sTUFBTSxDQUFDLElBQVksRUFBRSxHQUFZLEVBQUUsT0FBZ0I7UUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLElBQUk7WUFDSixHQUFHO1lBQ0gsUUFBUSxFQUFFLE9BQU87U0FDbEIsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFNBQVMsQ0FBQyxHQUFXO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBWSxFQUFFLEtBQWEsRUFBRSxNQUFNLEdBQUcsS0FBSztRQUN0RCxJQUFJLENBQUMsSUFBSTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsS0FBSztZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxHQUFHLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxPQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBVztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sU0FBUyxDQUFDLElBQVUsSUFBSSxJQUFJLEVBQUU7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQVcsRUFBRSxPQUFnQjtRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFDaEQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQVc7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sS0FBSztRQUNWLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQzlCLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ2xCLENBQUMsQ0FBQztvQkFDQSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO29CQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO29CQUNyQixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2lCQUNoQztnQkFDRCxDQUFDLENBQUMsU0FBUztZQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzVDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMxQixNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ2xCLENBQUMsQ0FBQztvQkFDQSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO29CQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2lCQUNoQztnQkFDRCxDQUFDLENBQUMsU0FBUztZQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNsQixHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN0QyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUN2RSxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBckhELG9DQXFIQyJ9