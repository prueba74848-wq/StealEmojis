import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { clipboard } from "@vendetta/metro/common";
import { getEmojiUrl, EmojiNode } from "../../lib/utils/getEmojiUrl";
import {
    AuthenticationStore,
    GuildIcon,
    GuildIconSizes,
    LazyActionSheet,
    RestAPI,
} from "../../modules";

var FormRow = Forms?.FormRow;
var FormIcon = Forms?.FormIcon;

// Fetches the emoji's bytes and returns a base64 data URI, trying the
// animated (.gif) URL first when we're not sure, and falling back to
// the static (.png) URL if that fails. Discord's emoji creation endpoint
// wants the image as `data:<mime>;base64,<data>` in a plain JSON body —
// no multipart involved, so this sidesteps the FormData issues entirely.
async function fetchEmojiAsDataUrl(emoji: EmojiNode): Promise<{ dataUrl: string; ext: string } | null> {
    var candidates: { url: string; ext: string }[] = [];

    if (emoji.animated === true) {
        candidates.push({ url: getEmojiUrl({ ...emoji, animated: true })!, ext: "gif" });
    } else if (emoji.animated === false) {
        candidates.push({ url: getEmojiUrl({ ...emoji, animated: false })!, ext: "png" });
    } else {
        // Unknown — try animated first, then static.
        candidates.push({ url: getEmojiUrl({ ...emoji, animated: true })!, ext: "gif" });
        candidates.push({ url: getEmojiUrl({ ...emoji, animated: false })!, ext: "png" });
    }

    for (var candidate of candidates) {
        if (!candidate.url) continue;
        try {
            var res = await fetch(candidate.url);
            if (!res.ok) continue;
            var blob = await res.blob();
            var dataUrl: string = await new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onloadend = function () { resolve(reader.result as string); };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            return { dataUrl, ext: candidate.ext };
        } catch (e) {
            // try next candidate
        }
    }
    return null;
}

export default function AddEmojiToServerRow({
    guild,
    emoji,
}: {
    guild: any;
    emoji: EmojiNode;
}) {
    if (!FormRow) return null;

    var addToServer = async function () {
        LazyActionSheet?.hideActionSheet?.();
        try {
            var fetched = await fetchEmojiAsDataUrl(emoji);
            if (!fetched) {
                showToast("Couldn't download that emoji's image", getAssetIDByName("Small"));
                return;
            }

            var token = AuthenticationStore?.getToken?.();
            var name = (emoji.name || "emoji").replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 32) || "emoji";

            var body = { name: name, image: fetched.dataUrl, roles: [] };
            var ok = false;
            var resultBody: any = null;
            var status = 0;

            if (RestAPI?.post) {
                try {
                    var apiRes = await RestAPI.post({
                        url: "/guilds/" + guild.id + "/emojis",
                        body: body,
                    });
                    ok = true;
                    resultBody = apiRes?.body;
                } catch (e: any) {
                    resultBody = e?.body ?? e?.response?.body ?? { message: e?.message ?? String(e) };
                    status = e?.status ?? 0;
                }
            } else {
                var rawRes = await fetch(
                    "https://discord.com/api/v10/guilds/" + guild.id + "/emojis",
                    {
                        method: "POST",
                        headers: { Authorization: token, "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    }
                );
                ok = rawRes.ok;
                status = rawRes.status;
                resultBody = await rawRes.json().catch(function () { return {}; });
            }

            if (ok) {
                showToast("Added :" + name + ": to " + guild.name, getAssetIDByName("Check"));
            } else {
                var fullErrorText = JSON.stringify(resultBody ?? { message: "no body", status: status });
                clipboard.setString(fullErrorText);
                showToast(
                    resultBody?.message
                        ? resultBody.message + " — full error copied to clipboard"
                        : "Failed — full error copied to clipboard",
                    getAssetIDByName("Small")
                );
            }
        } catch (e: any) {
            showToast(e?.message ?? "Something went wrong", getAssetIDByName("Small"));
        }
    };

    return (
        <FormRow
            leading={GuildIcon ? <GuildIcon guild={guild} size={GuildIconSizes?.MEDIUM} animate={false} /> : undefined}
            label={guild.name}
            trailing={FormIcon ? <FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} /> : undefined}
            onPress={addToServer}
        />
    );
}
