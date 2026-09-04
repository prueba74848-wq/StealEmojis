import patchMessageEmojiActionSheet from "./patches/MessageEmojiActionSheet";

var patches: (() => void)[] = [];

export default {
    onLoad: () => {
        patches.push(patchMessageEmojiActionSheet());
    },
    onUnload: () => {
        for (var unpatch of patches) unpatch();
    },
};
