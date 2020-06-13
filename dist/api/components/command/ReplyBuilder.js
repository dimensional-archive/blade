"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyBuilder = void 0;
const __1 = require("../../..");
class ReplyBuilder {
    constructor(ctx) {
        this.ctx = ctx;
        this._tts = false;
        this._files = [];
    }
    content(str) {
        this._content = str;
        return this;
    }
    tts(value) {
        this._tts = value;
        return this;
    }
    file(file) {
        this._files.push(file);
        return this;
    }
    embed(embed) {
        this._embed = typeof embed === "function"
            ? embed(new __1.EmbedBuilder(), this.ctx).build()
            : embed instanceof __1.EmbedBuilder
                ? embed.build()
                : embed;
        return this;
    }
    display(tc) {
        return tc.createMessage({
            tts: this._tts,
            content: this._content,
            embed: this._embed,
        }, this._files);
    }
    build() {
        return [{
                tts: this._tts,
                content: this._content,
                embed: this._embed,
            }, this._files];
    }
}
exports.ReplyBuilder = ReplyBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbHlCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaS9jb21wb25lbnRzL2NvbW1hbmQvUmVwbHlCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGdDQUF3QztBQUV4QyxNQUFhLFlBQVk7SUFRdkIsWUFBbUIsR0FBWTtRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSxPQUFPLENBQUMsR0FBVztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxHQUFHLENBQUMsS0FBYztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxJQUFJLENBQUMsSUFBaUI7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQTRGO1FBQ3ZHLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxLQUFLLEtBQUssVUFBVTtZQUN2QyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksZ0JBQVksRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDN0MsQ0FBQyxDQUFDLEtBQUssWUFBWSxnQkFBWTtnQkFDN0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ2YsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNaLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLE9BQU8sQ0FBQyxFQUFtQjtRQUNoQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDdEIsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRU0sS0FBSztRQUNWLE9BQU8sQ0FBRTtnQkFDUCxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDbkIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBckRELG9DQXFEQyJ9