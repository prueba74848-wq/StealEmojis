import { findByProps } from "@vendetta/metro";
import { clipboard, ReactNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { EmojiNode, getEmojiUrl } from "../../lib/utils/getEmojiUrl";
import { showAddEmojiToServerActionSheet } from "../sheets/AddEmojiToServerActionSheet";
import { LazyActionSheet } from "../../modules";

var ButtonModule = findByProps("TableRow", "Button") ?? findByProps("Button");
var Button = ButtonModule?.Button ?? ButtonModule?.default;

export default function EmojiButtons({ emoji }: { emoji: EmojiNode }) {
    if (!Button) return null;
    if (!emoji?.id) return null;

    var url = getEmojiUrl(emoji)!;
    var platform = ReactNative.Platform;

    var buttons = [
        {
            text: "Add to Server",
            callback: function () {
                showAddEmojiToServerActionSheet(emoji);
            },
        },
        {
            text: "Copy URL to clipboard",
            callback: function () {
                clipboard.setString(url);
                LazyActionSheet?.hideActionSheet?.();
                showToast("Copied :" + emoji.name + ":'s URL", getAssetIDByName("ic_copy_message_link"));
            },
        },
    ];

    return (
        <>
            {buttons.map(function ({ text, callback }) {
                return (
                    <Button
                        color={Button.Colors?.BRAND}
                        text={text}
                        size={Button.Sizes?.SMALL}
                        onPress={callback}
                        style={{ marginTop: platform.select({ android: 12, default: 16 }) }}
                    />
                );
            })}
        </>
    );
}
