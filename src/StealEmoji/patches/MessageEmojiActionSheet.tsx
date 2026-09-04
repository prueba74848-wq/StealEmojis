import { React } from "@vendetta/metro/common";
import { after, instead } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";
import { General } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { clipboard } from "@vendetta/metro/common";
import { LazyActionSheet } from "../modules";
import EmojiButtons from "../ui/components/EmojiButtons";
import { EmojiNode, getEmojiUrl } from "../lib/utils/getEmojiUrl";
import { findByProps } from "@vendetta/metro";

var { TouchableOpacity } = General;

var _patchedModules = new WeakSet();

var DirectSheet =
    findByProps("EmojiDetails") ??
    findByProps("emojiActionSheet") ??
    findByProps("EmojiActionSheet");

export default function patchMessageEmojiActionSheet() {
    if (DirectSheet) {
        return patchSheet("default", DirectSheet);
    }

    if (!LazyActionSheet?.openLazy) {
        return function () {};
    }

    var patches: (() => void)[] = [];

    var unpatchLazy = instead(
        "openLazy",
        LazyActionSheet,
        function (args: any[], originalOpenLazy: Function) {
            var lazySheet = args[0];
            var name: string = args[1] ?? "";
            var context: any = args[2];

            var nameLower = (name || "").toLowerCase();
            if (!nameLower.includes("emoji") || nameLower.includes("addtoserver")) {
                return originalOpenLazy.apply(this, args);
            }

            // TEMP DEBUG — remove once we confirm the real sheet name and
            // context shape. Copies details to clipboard so nothing gets
            // truncated by the toast.
            try {
                var debugInfo =
                    "sheet=" + name +
                    " ctxKeys=" + Object.keys(context ?? {}).join(",") +
                    " emoji=" + JSON.stringify(context?.emoji ?? null) +
                    " renderableEmoji=" + JSON.stringify(context?.renderableEmoji ?? null) +
                    " reaction=" + JSON.stringify(context?.reaction ?? null);
                clipboard.setString(debugInfo);
                showToast("Emoji sheet debug copied to clipboard — paste it somewhere");
            } catch (e) {}

            var emoji: EmojiNode | undefined =
                context?.emoji ??
                context?.renderableEmoji ??
                context?.reaction?.emoji;

            if (!lazySheet || typeof lazySheet.then !== "function") {
                return originalOpenLazy.apply(this, args);
            }

            var patchedPromise = lazySheet.then(function (module: any) {
                var target = module.default;

                if (_patchedModules.has(module)) {
                    if (module._seCurrentEmoji !== undefined) {
                        module._seCurrentEmoji = emoji;
                    }
                    return module;
                }

                var renderFn: Function | null = null;
                var renderHost: any = null;
                var renderKey: string = "";

                if (typeof target === "function") {
                    renderFn = target;
                    renderHost = module;
                    renderKey = "default";
                } else if (typeof target === "object" && target !== null) {
                    if (typeof target.type === "function") {
                        renderFn = target.type;
                        renderHost = target;
                        renderKey = "type";
                    } else if (typeof target.render === "function") {
                        renderFn = target.render;
                        renderHost = target;
                        renderKey = "render";
                    } else if (typeof target.type === "object" && target.type !== null) {
                        if (typeof target.type.render === "function") {
                            renderFn = target.type.render;
                            renderHost = target.type;
                            renderKey = "render";
                        } else if (typeof target.type.type === "function") {
                            renderFn = target.type.type;
                            renderHost = target.type;
                            renderKey = "type";
                        }
                    }
                    if (!renderFn) {
                        for (var k of Object.keys(target)) {
                            if (typeof target[k] === "function") {
                                renderFn = target[k];
                                renderHost = target;
                                renderKey = k;
                                break;
                            }
                        }
                    }
                }

                if (!renderFn || !renderHost) {
                    return module;
                }

                module._seCurrentEmoji = emoji;

                var OriginalRender = renderFn;
                renderHost[renderKey] = function PatchedEmojiRender() {
                    var res: any;
                    try {
                        res = OriginalRender.apply(this, arguments);
                    } catch (e: any) {
                        throw e;
                    }

                    var props = arguments[0] ?? {};
                    var finalEmoji: EmojiNode | undefined =
                        module._seCurrentEmoji ??
                        props?.emoji ??
                        props?.renderableEmoji ??
                        props?.reaction?.emoji;

                    if (finalEmoji && res) {
                        try {
                            injectButtons(res, finalEmoji);
                        } catch (_) {}
                    }

                    return res;
                };

                _patchedModules.add(module);
                return module;
            });

            return originalOpenLazy.call(this, patchedPromise, name, context);
        }
    );

    patches.push(unpatchLazy);
    return function () {
        patches.forEach(function (p) {
            p?.();
        });
    };
}

function injectButtons(res: any, emoji: EmojiNode) {
    if (!res) return;
    if (res._seInjected) return;
    res._seInjected = true;

    var emojiUrl = getEmojiUrl(emoji);

    var view = res?.props?.children?.props?.children;
    if (view && typeof view === "object" && typeof view.type === "function") {
        var unpatchView = after("type", view, function (_: any, component: any) {
            React.useEffect(function () {
                return unpatchView;
            }, []);
            addButtonsToComponent(component, emoji, emojiUrl);
        });
        return;
    }

    if (res?.type && typeof res.type === "function") {
        var origType = res.type;
        res.type = function () {
            var component = origType.apply(this, arguments);
            addButtonsToComponent(component, emoji, emojiUrl);
            return component;
        };
        try {
            Object.assign(res.type, origType);
        } catch (_) {}
        return;
    }

    if (typeof res?.props?.children === "function") {
        var origRender = res.props.children;
        res.props.children = function () {
            var rendered = origRender.apply(this, arguments);
            appendToTree(rendered, <EmojiButtons emoji={emoji} />);
            return rendered;
        };
        return;
    }

    appendToTree(res, <EmojiButtons emoji={emoji} />);
}

function addButtonsToComponent(component: any, emoji: EmojiNode, emojiUrl: string | null) {
    if (emojiUrl) {
        var isIcon = function (c: any) {
            return c?.props?.source?.uri;
        };
        var iconContainer = findInReactTree(component, function (c: any) {
            return c?.find?.(isIcon);
        });
        var iconIdx = iconContainer?.findIndex?.(isIcon) ?? -1;
        if (iconIdx >= 0) {
            iconContainer[iconIdx] = (
                <TouchableOpacity>
                    {iconContainer[iconIdx]}
                </TouchableOpacity>
            );
        }
    }

    var isButton = function (c: any) {
        var n = c?.type?.name ?? c?.type?.displayName ?? "";
        return n === "Button" || n === "CompatButton";
    };
    var btnContainer = findInReactTree(component, function (c: any) {
        return c?.find?.(isButton);
    });
    var btnIdx = btnContainer?.findLastIndex?.(isButton) ?? -1;
    var el = <EmojiButtons emoji={emoji} />;

    if (btnIdx >= 0) {
        btnContainer.splice(btnIdx + 1, 0, el);
    } else {
        appendToTree(component, el);
    }
}

function appendToTree(tree: any, element: any) {
    if (!tree) return;
    if (Array.isArray(tree?.props?.children)) {
        tree.props.children.push(element);
    } else if (tree?.props?.children != null) {
        tree.props.children = [tree.props.children, element];
    } else if (tree?.props) {
        tree.props.children = element;
    } else if (Array.isArray(tree)) {
        tree.push(element);
    }
}

function patchSheet(funcName: string, sheetModule: any) {
    return after(funcName, sheetModule, function (callArgs: any[], res: any) {
        var props = callArgs[0] ?? {};
        var e: EmojiNode | undefined = props?.emoji ?? props?.renderableEmoji ?? props?.reaction?.emoji;
        if (!e) return;
        injectButtons(res, e);
    });
}
