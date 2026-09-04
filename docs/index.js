(function () {
    var module = { exports: {} };
    var exports = module.exports;

    function require(id) {
        switch (id) {
            case "@vendetta":
                return vendetta;
            case "@vendetta/patcher":
                return vendetta.patcher;
            case "@vendetta/metro":
                return vendetta.metro;
            case "@vendetta/metro/common":
                return vendetta.metro.common;
            case "@vendetta/utils":
                return vendetta.utils;
            case "@vendetta/ui":
                return vendetta.ui;
            case "@vendetta/ui/assets":
                return vendetta.ui.assets;
            case "@vendetta/ui/toasts":
                return vendetta.ui.toasts;
            case "@vendetta/ui/components":
                return vendetta.ui.components;
            case "@vendetta/storage":
                return vendetta.storage;
            case "@vendetta/commands":
                return vendetta.commands;
            default:
                throw new Error("[StealSticker] Unknown module: " + id);
        }
    }

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/StealEmoji/StealEmoji_index.ts
var StealEmoji_index_exports = {};
__export(StealEmoji_index_exports, {
  default: () => StealEmoji_index_default
});
module.exports = __toCommonJS(StealEmoji_index_exports);

// src/StealEmoji/patches/MessageEmojiActionSheet.tsx
var import_common4 = require("@vendetta/metro/common");
var import_patcher = require("@vendetta/patcher");
var import_utils = require("@vendetta/utils");
var import_components3 = require("@vendetta/ui/components");
var import_toasts3 = require("@vendetta/ui/toasts");
var import_common5 = require("@vendetta/metro/common");

// src/StealEmoji/modules.ts
var import_metro = require("@vendetta/metro");
var LazyActionSheet = (0, import_metro.findByProps)("hideActionSheet");
var MediaModalUtils = (0, import_metro.findByProps)("openMediaModal");
var ActionSheet = (0, import_metro.findByProps)("ActionSheet")?.ActionSheet ?? (0, import_metro.find)((m) => m.render?.name === "ActionSheet");
var { ActionSheetTitleHeader, ActionSheetCloseButton } = (0, import_metro.findByProps)("ActionSheetTitleHeader") ?? {};
var { BottomSheetFlatList } = (0, import_metro.findByProps)("BottomSheetScrollView") ?? {};
var GuildStore = (0, import_metro.findByStoreName)("GuildStore");
var StickerStore = (0, import_metro.findByStoreName)("StickersStore") ?? (0, import_metro.findByStoreName)("StickerStore");
var PermissionsStore = (0, import_metro.findByStoreName)("PermissionStore");
var AuthenticationStore = (0, import_metro.findByStoreName)("AuthenticationStore");
var RestAPI = (0, import_metro.findByProps)("getAPIBaseURL", "get", "post") ?? (0, import_metro.findByProps)("get", "post", "patch");
var { default: GuildIcon, GuildIconSizes } = (0, import_metro.findByProps)("GuildIconSizes") ?? {};
var { downloadMediaAsset } = (0, import_metro.findByProps)("downloadMediaAsset") ?? {};
var constants = (0, import_metro.findByProps)("Fonts", "Permissions");

// src/StealEmoji/lib/utils/resolveEmoji.ts
// Defensive emoji extractor: tries the historically-known flat shape first,
// then falls back to the newer `emojiNode` wrapper shape (and a couple of
// plausible nested variants), so a future client rename doesn't null out
// every field at once again.
function resolveEmoji(ctxOrProps) {
  if (!ctxOrProps)
    return null;
  var c = ctxOrProps;
  var direct = c.emoji ?? c.renderableEmoji ?? c.reaction?.emoji;
  if (direct)
    return direct;
  var node = c.emojiNode;
  if (node) {
    if (node.id || node.name)
      return node;
    var nested = node.emoji ?? node.renderableEmoji ?? node.reaction?.emoji ?? node.node;
    if (nested)
      return nested;
  }
  return null;
}

// src/StealEmoji/ui/components/EmojiButtons.tsx
var import_metro2 = require("@vendetta/metro");
var import_common3 = require("@vendetta/metro/common");
var import_assets2 = require("@vendetta/ui/assets");
var import_toasts2 = require("@vendetta/ui/toasts");

// src/StealEmoji/lib/utils/getEmojiUrl.ts
function getEmojiUrl(emoji, size = 160) {
  if (!emoji.id)
    return null;
  var ext = emoji.animated ? "gif" : "png";
  return "https://cdn.discordapp.com/emojis/" + emoji.id + "." + ext + "?size=" + size;
}

// src/StealEmoji/ui/sheets/AddEmojiToServerActionSheet.tsx
var import_common2 = require("@vendetta/metro/common");
var import_components2 = require("@vendetta/ui/components");

// src/StealEmoji/ui/components/AddEmojiToServerRow.tsx
var import_assets = require("@vendetta/ui/assets");
var import_components = require("@vendetta/ui/components");
var import_toasts = require("@vendetta/ui/toasts");
var import_common = require("@vendetta/metro/common");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done)
    resolve(value);
  else
    Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
var FormRow = import_components.Forms?.FormRow;
var FormIcon = import_components.Forms?.FormIcon;
function fetchEmojiAsDataUrl(emoji) {
  return _async_to_generator(function* () {
    var candidates = [];
    if (emoji.animated === true) {
      candidates.push({
        url: getEmojiUrl({
          ...emoji,
          animated: true
        }),
        ext: "gif"
      });
    } else if (emoji.animated === false) {
      candidates.push({
        url: getEmojiUrl({
          ...emoji,
          animated: false
        }),
        ext: "png"
      });
    } else {
      candidates.push({
        url: getEmojiUrl({
          ...emoji,
          animated: true
        }),
        ext: "gif"
      });
      candidates.push({
        url: getEmojiUrl({
          ...emoji,
          animated: false
        }),
        ext: "png"
      });
    }
    for (var candidate of candidates) {
      if (!candidate.url)
        continue;
      try {
        var res = yield fetch(candidate.url);
        if (!res.ok)
          continue;
        var blob = yield res.blob();
        var dataUrl = yield new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        return {
          dataUrl,
          ext: candidate.ext
        };
      } catch (e) {
      }
    }
    return null;
  })();
}
function AddEmojiToServerRow({ guild, emoji }) {
  if (!FormRow)
    return null;
  var addToServer = function addToServer2() {
    return _async_to_generator(function* () {
      LazyActionSheet?.hideActionSheet?.();
      try {
        var fetched = yield fetchEmojiAsDataUrl(emoji);
        if (!fetched) {
          (0, import_toasts.showToast)("Couldn't download that emoji's image", (0, import_assets.getAssetIDByName)("Small"));
          return;
        }
        var token = AuthenticationStore?.getToken?.();
        var name = (emoji.name || "emoji").replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 32) || "emoji";
        var body = {
          name,
          image: fetched.dataUrl,
          roles: []
        };
        var ok = false;
        var resultBody = null;
        var status = 0;
        if (RestAPI?.post) {
          try {
            var apiRes = yield RestAPI.post({
              url: "/guilds/" + guild.id + "/emojis",
              body
            });
            ok = true;
            resultBody = apiRes?.body;
          } catch (e) {
            resultBody = e?.body ?? e?.response?.body ?? {
              message: e?.message ?? String(e)
            };
            status = e?.status ?? 0;
          }
        } else {
          var rawRes = yield fetch("https://discord.com/api/v10/guilds/" + guild.id + "/emojis", {
            method: "POST",
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          });
          ok = rawRes.ok;
          status = rawRes.status;
          resultBody = yield rawRes.json().catch(function() {
            return {};
          });
        }
        if (ok) {
          (0, import_toasts.showToast)("Added :" + name + ": to " + guild.name, (0, import_assets.getAssetIDByName)("Check"));
        } else {
          var fullErrorText = JSON.stringify(resultBody ?? {
            message: "no body",
            status
          });
          import_common.clipboard.setString(fullErrorText);
          (0, import_toasts.showToast)(resultBody?.message ? resultBody.message + " \u2014 full error copied to clipboard" : "Failed \u2014 full error copied to clipboard", (0, import_assets.getAssetIDByName)("Small"));
        }
      } catch (e) {
        (0, import_toasts.showToast)(e?.message ?? "Something went wrong", (0, import_assets.getAssetIDByName)("Small"));
      }
    })();
  };
  return /* @__PURE__ */ React.createElement(FormRow, {
    leading: GuildIcon ? /* @__PURE__ */ React.createElement(GuildIcon, {
      guild,
      size: GuildIconSizes?.MEDIUM,
      animate: false
    }) : void 0,
    label: guild.name,
    trailing: FormIcon ? /* @__PURE__ */ React.createElement(FormIcon, {
      style: {
        opacity: 1
      },
      source: (0, import_assets.getAssetIDByName)("ic_add_24px")
    }) : void 0,
    onPress: addToServer
  });
}

// src/StealEmoji/ui/sheets/AddEmojiToServerActionSheet.tsx
var FormDivider = import_components2.Forms?.FormDivider;
var FormIcon2 = import_components2.Forms?.FormIcon;
var EMOJI_PERM = constants?.Permissions?.MANAGE_GUILD_EXPRESSIONS ?? constants?.Permissions?.MANAGE_EMOJIS_AND_STICKERS ?? constants?.Permissions?.MANAGE_EMOJIS ?? constants?.Permissions?.CREATE_GUILD_EXPRESSIONS ?? 1073741824n;
var CREATE_PERM = constants?.Permissions?.CREATE_GUILD_EXPRESSIONS ?? null;
function showAddEmojiToServerActionSheet(emoji) {
  if (!LazyActionSheet?.openLazy)
    return;
  LazyActionSheet.openLazy(Promise.resolve({
    default: function _default() {
      return /* @__PURE__ */ import_common2.React.createElement(AddEmojiToServer, {
        emoji
      });
    }
  }), "AddEmojiToServerActionSheet");
}
function AddEmojiToServer({ emoji }) {
  var guilds = Object.values(GuildStore?.getGuilds?.() ?? {}).filter(function(g) {
    if (!PermissionsStore?.can)
      return false;
    var canManage = EMOJI_PERM ? PermissionsStore.can(EMOJI_PERM, g) : false;
    var canCreate = CREATE_PERM ? PermissionsStore.can(CREATE_PERM, g) : false;
    return canManage || canCreate;
  }).sort(function(a, b) {
    return a.name?.localeCompare?.(b.name);
  });
  var previewUrl = getEmojiUrl(emoji, 64);
  return /* @__PURE__ */ import_common2.React.createElement(ActionSheet, {
    scrollable: true
  }, /* @__PURE__ */ import_common2.React.createElement(import_components2.ErrorBoundary, null, ActionSheetTitleHeader ? /* @__PURE__ */ import_common2.React.createElement(ActionSheetTitleHeader, {
    title: "Stealing :" + emoji.name + ":",
    leading: previewUrl && FormIcon2 ? /* @__PURE__ */ import_common2.React.createElement(FormIcon2, {
      style: {
        marginRight: 12,
        opacity: 1
      },
      source: {
        uri: previewUrl
      },
      disableColor: true
    }) : void 0,
    trailing: ActionSheetCloseButton ? /* @__PURE__ */ import_common2.React.createElement(ActionSheetCloseButton, {
      onPress: function onPress() {
        LazyActionSheet?.hideActionSheet?.();
      }
    }) : void 0
  }) : null, BottomSheetFlatList ? /* @__PURE__ */ import_common2.React.createElement(BottomSheetFlatList, {
    style: {
      flex: 1
    },
    contentContainerStyle: {
      paddingBottom: 24
    },
    data: guilds,
    renderItem: function renderItem({ item }) {
      return /* @__PURE__ */ import_common2.React.createElement(AddEmojiToServerRow, {
        guild: item,
        emoji
      });
    },
    ItemSeparatorComponent: FormDivider,
    keyExtractor: function keyExtractor(x) {
      return x.id;
    }
  }) : null));
}

// src/StealEmoji/ui/components/EmojiButtons.tsx
var ButtonModule = (0, import_metro2.findByProps)("TableRow", "Button") ?? (0, import_metro2.findByProps)("Button");
var Button = ButtonModule?.Button ?? ButtonModule?.default;
function EmojiButtons({ emoji }) {
  if (!Button)
    return null;
  if (!emoji?.id)
    return null;
  var url = getEmojiUrl(emoji);
  var platform = import_common3.ReactNative.Platform;
  var buttons = [
    {
      text: "Add to Server",
      callback: function callback() {
        showAddEmojiToServerActionSheet(emoji);
      }
    },
    {
      text: "Copy URL to clipboard",
      callback: function callback() {
        import_common3.clipboard.setString(url);
        LazyActionSheet?.hideActionSheet?.();
        (0, import_toasts2.showToast)("Copied :" + emoji.name + ":'s URL", (0, import_assets2.getAssetIDByName)("ic_copy_message_link"));
      }
    }
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, buttons.map(function({ text, callback }) {
    return /* @__PURE__ */ React.createElement(Button, {
      color: Button.Colors?.BRAND,
      text,
      size: Button.Sizes?.SMALL,
      onPress: callback,
      style: {
        marginTop: platform.select({
          android: 12,
          default: 16
        })
      }
    });
  }));
}

// src/StealEmoji/patches/MessageEmojiActionSheet.tsx
var import_metro3 = require("@vendetta/metro");
var { TouchableOpacity } = import_components3.General;
var _patchedModules = /* @__PURE__ */ new WeakSet();
var DirectSheet = (0, import_metro3.findByProps)("EmojiDetails") ?? (0, import_metro3.findByProps)("emojiActionSheet") ?? (0, import_metro3.findByProps)("EmojiActionSheet");
function patchMessageEmojiActionSheet() {
  if (DirectSheet) {
    return patchSheet("default", DirectSheet);
  }
  if (!LazyActionSheet?.openLazy) {
    return function() {
    };
  }
  var patches2 = [];
  var unpatchLazy = (0, import_patcher.instead)("openLazy", LazyActionSheet, function(args, originalOpenLazy) {
    var lazySheet = args[0];
    var name = args[1] ?? "";
    var context = args[2];
    var nameLower = (name || "").toLowerCase();
    if (!nameLower.includes("emoji") || nameLower.includes("addtoserver")) {
      return originalOpenLazy.apply(this, args);
    }
    try {
      var debugInfo = "sheet=" + name +
        " ctxKeys=" + Object.keys(context ?? {}).join(",") +
        " emojiNode=" + JSON.stringify(context?.emojiNode ?? null) +
        " emoji=" + JSON.stringify(context?.emoji ?? null) +
        " renderableEmoji=" + JSON.stringify(context?.renderableEmoji ?? null) +
        " reaction=" + JSON.stringify(context?.reaction ?? null);
      import_common5.clipboard.setString(debugInfo);
      (0, import_toasts3.showToast)("Emoji sheet debug copied to clipboard \u2014 paste it somewhere");
    } catch (e) {
    }
    var emoji = resolveEmoji(context);
    if (!lazySheet || typeof lazySheet.then !== "function") {
      return originalOpenLazy.apply(this, args);
    }
    var patchedPromise = lazySheet.then(function(module2) {
      var target = module2.default;
      if (_patchedModules.has(module2)) {
        if (module2._seCurrentEmoji !== void 0) {
          module2._seCurrentEmoji = emoji;
        }
        return module2;
      }
      var renderFn = null;
      var renderHost = null;
      var renderKey = "";
      if (typeof target === "function") {
        renderFn = target;
        renderHost = module2;
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
        return module2;
      }
      module2._seCurrentEmoji = emoji;
      var OriginalRender = renderFn;
      renderHost[renderKey] = function PatchedEmojiRender() {
        var res;
        try {
          res = OriginalRender.apply(this, arguments);
        } catch (e) {
          throw e;
        }
        var props = arguments[0] ?? {};
        var finalEmoji = module2._seCurrentEmoji ?? resolveEmoji(props);
        if (finalEmoji && res) {
          try {
            injectButtons(res, finalEmoji);
          } catch (_) {
          }
        }
        return res;
      };
      _patchedModules.add(module2);
      return module2;
    });
    return originalOpenLazy.call(this, patchedPromise, name, context);
  });
  patches2.push(unpatchLazy);
  return function() {
    patches2.forEach(function(p) {
      p?.();
    });
  };
}
function injectButtons(res, emoji) {
  if (!res)
    return;
  if (res._seInjected)
    return;
  res._seInjected = true;
  var emojiUrl = getEmojiUrl(emoji);
  var view = res?.props?.children?.props?.children;
  if (view && typeof view === "object" && typeof view.type === "function") {
    var unpatchView = (0, import_patcher.after)("type", view, function(_, component) {
      import_common4.React.useEffect(function() {
        return unpatchView;
      }, []);
      addButtonsToComponent(component, emoji, emojiUrl);
    });
    return;
  }
  if (res?.type && typeof res.type === "function") {
    var origType = res.type;
    res.type = function() {
      var component = origType.apply(this, arguments);
      addButtonsToComponent(component, emoji, emojiUrl);
      return component;
    };
    try {
      Object.assign(res.type, origType);
    } catch (_) {
    }
    return;
  }
  if (typeof res?.props?.children === "function") {
    var origRender = res.props.children;
    res.props.children = function() {
      var rendered = origRender.apply(this, arguments);
      appendToTree(rendered, /* @__PURE__ */ import_common4.React.createElement(EmojiButtons, {
        emoji
      }));
      return rendered;
    };
    return;
  }
  appendToTree(res, /* @__PURE__ */ import_common4.React.createElement(EmojiButtons, {
    emoji
  }));
}
function addButtonsToComponent(component, emoji, emojiUrl) {
  if (emojiUrl) {
    var isIcon = function isIcon2(c) {
      return c?.props?.source?.uri;
    };
    var iconContainer = (0, import_utils.findInReactTree)(component, function(c) {
      return c?.find?.(isIcon);
    });
    var iconIdx = iconContainer?.findIndex?.(isIcon) ?? -1;
    if (iconIdx >= 0) {
      iconContainer[iconIdx] = /* @__PURE__ */ import_common4.React.createElement(TouchableOpacity, null, iconContainer[iconIdx]);
    }
  }
  var isButton = function isButton2(c) {
    var n = c?.type?.name ?? c?.type?.displayName ?? "";
    return n === "Button" || n === "CompatButton";
  };
  var btnContainer = (0, import_utils.findInReactTree)(component, function(c) {
    return c?.find?.(isButton);
  });
  var btnIdx = btnContainer?.findLastIndex?.(isButton) ?? -1;
  var el = /* @__PURE__ */ import_common4.React.createElement(EmojiButtons, {
    emoji
  });
  if (btnIdx >= 0) {
    btnContainer.splice(btnIdx + 1, 0, el);
  } else {
    appendToTree(component, el);
  }
}
function appendToTree(tree, element) {
  if (!tree)
    return;
  if (Array.isArray(tree?.props?.children)) {
    tree.props.children.push(element);
  } else if (tree?.props?.children != null) {
    tree.props.children = [
      tree.props.children,
      element
    ];
  } else if (tree?.props) {
    tree.props.children = element;
  } else if (Array.isArray(tree)) {
    tree.push(element);
  }
}
function patchSheet(funcName, sheetModule) {
  return (0, import_patcher.after)(funcName, sheetModule, function(callArgs, res) {
    var props = callArgs[0] ?? {};
    var e = resolveEmoji(props);
    if (!e)
      return;
    injectButtons(res, e);
  });
}

// src/StealEmoji/StealEmoji_index.ts
var patches = [];
var StealEmoji_index_default = {
  onLoad: () => {
    patches.push(patchMessageEmojiActionSheet());
  },
  onUnload: () => {
    for (var unpatch of patches)
      unpatch();
  }
};


    return module.exports && module.exports.default !== undefined
        ? module.exports.default
        : module.exports;
})()
