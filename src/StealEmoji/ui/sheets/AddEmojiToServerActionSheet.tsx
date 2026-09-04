import { React } from "@vendetta/metro/common";
import { Forms, ErrorBoundary } from "@vendetta/ui/components";
import { EmojiNode, getEmojiUrl } from "../../lib/utils/getEmojiUrl";
import AddEmojiToServerRow from "../components/AddEmojiToServerRow";
import {
    ActionSheet,
    ActionSheetTitleHeader,
    ActionSheetCloseButton,
    BottomSheetFlatList,
    GuildStore,
    PermissionsStore,
    LazyActionSheet,
    constants,
} from "../../modules";

var FormDivider = Forms?.FormDivider;
var FormIcon = Forms?.FormIcon;

var EMOJI_PERM =
    constants?.Permissions?.MANAGE_GUILD_EXPRESSIONS ??
    constants?.Permissions?.MANAGE_EMOJIS_AND_STICKERS ??
    constants?.Permissions?.MANAGE_EMOJIS ??
    constants?.Permissions?.CREATE_GUILD_EXPRESSIONS ??
    1073741824n;
var CREATE_PERM = constants?.Permissions?.CREATE_GUILD_EXPRESSIONS ?? null;

export function showAddEmojiToServerActionSheet(emoji: EmojiNode) {
    if (!LazyActionSheet?.openLazy) return;
    LazyActionSheet.openLazy(
        Promise.resolve({
            default: function () {
                return <AddEmojiToServer emoji={emoji} />;
            },
        }),
        "AddEmojiToServerActionSheet"
    );
}

function AddEmojiToServer({ emoji }: { emoji: EmojiNode }) {
    var guilds = Object.values(GuildStore?.getGuilds?.() ?? {})
        .filter(function (g: any) {
            if (!PermissionsStore?.can) return false;
            var canManage = EMOJI_PERM ? PermissionsStore.can(EMOJI_PERM, g) : false;
            var canCreate = CREATE_PERM ? PermissionsStore.can(CREATE_PERM, g) : false;
            return canManage || canCreate;
        })
        .sort(function (a: any, b: any) {
            return a.name?.localeCompare?.(b.name);
        });

    var previewUrl = getEmojiUrl(emoji, 64);

    return (
        <ActionSheet scrollable>
            <ErrorBoundary>
                {ActionSheetTitleHeader ? (
                    <ActionSheetTitleHeader
                        title={"Stealing :" + emoji.name + ":"}
                        leading={
                            previewUrl && FormIcon ? (
                                <FormIcon
                                    style={{ marginRight: 12, opacity: 1 }}
                                    source={{ uri: previewUrl }}
                                    disableColor
                                />
                            ) : undefined
                        }
                        trailing={
                            ActionSheetCloseButton ? (
                                <ActionSheetCloseButton
                                    onPress={function () {
                                        LazyActionSheet?.hideActionSheet?.();
                                    }}
                                />
                            ) : undefined
                        }
                    />
                ) : null}
                {BottomSheetFlatList ? (
                    <BottomSheetFlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        data={guilds}
                        renderItem={function ({ item }: any) {
                            return <AddEmojiToServerRow guild={item} emoji={emoji} />;
                        }}
                        ItemSeparatorComponent={FormDivider}
                        keyExtractor={function (x: any) {
                            return x.id;
                        }}
                    />
                ) : null}
            </ErrorBoundary>
        </ActionSheet>
    );
}
