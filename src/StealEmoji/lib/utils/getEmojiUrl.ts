export interface EmojiNode {
    id?: string;
    name: string;
    animated?: boolean;
    require_colons?: boolean;
    guildId?: string;
    [key: string]: any;
}

// Static emojis are only ever served as .png; animated ones as .gif.
// If we don't know `animated` for certain (stripped context object on
// some platforms), callers should try the animated URL first and fall
// back to the static one on failure rather than trusting this alone.
export function getEmojiUrl(emoji: EmojiNode, size = 160): string | null {
    if (!emoji.id) return null;
    var ext = emoji.animated ? "gif" : "png";
    return "https://cdn.discordapp.com/emojis/" + emoji.id + "." + ext + "?size=" + size;
}

export function getEmojiUploadExtension(emoji: EmojiNode): string {
    return emoji.animated ? "gif" : "png";
}
