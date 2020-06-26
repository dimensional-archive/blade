"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbHlCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaS9jb21wb25lbnRzL2NvbW1hbmQvUmVwbHlCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsZ0NBQXdDO0FBRXhDLE1BQWEsWUFBWTtJQVF2QixZQUFtQixHQUFZO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxHQUFXO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEdBQUcsQ0FBQyxLQUFjO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLElBQUksQ0FBQyxJQUFpQjtRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBNEY7UUFDdkcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLEtBQUssS0FBSyxVQUFVO1lBQ3ZDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxnQkFBWSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUM3QyxDQUFDLENBQUMsS0FBSyxZQUFZLGdCQUFZO2dCQUM3QixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDZixDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sT0FBTyxDQUFDLEVBQW1CO1FBQ2hDLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUN0QixHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ25CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFTSxLQUFLO1FBQ1YsT0FBTyxDQUFFO2dCQUNQLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTthQUNuQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUFyREQsb0NBcURDIn0=