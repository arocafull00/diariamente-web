import { Avatar, Style } from "@dicebear/core";
import definition from "@dicebear/styles/clay.json" with { type: "json" };

import type { PredefinedAvatarId } from "@/lib/avatars";

const style = new Style(definition);

export function renderPredefinedAvatarSvg(avatarId: PredefinedAvatarId): string {
  return new Avatar(style, {
    seed: avatarId,
    animationVariant: "medium",
    topVariant: "ears",
  }).toString();
}
