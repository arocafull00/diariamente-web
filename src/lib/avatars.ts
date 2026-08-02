const predefinedAvatarIds = [
  "luna",
  "rocky",
  "milo",
  "coco",
  "nala",
  "simba",
  "toby",
  "mia",
  "max",
  "bella",
  "leo",
  "nina",
] as const;

export type PredefinedAvatarId = (typeof predefinedAvatarIds)[number];

const predefinedAvatarLabels: Record<PredefinedAvatarId, string> = {
  luna: "Luna",
  rocky: "Rocky",
  milo: "Milo",
  coco: "Coco",
  nala: "Nala",
  simba: "Simba",
  toby: "Toby",
  mia: "Mia",
  max: "Max",
  bella: "Bella",
  leo: "Leo",
  nina: "Nina",
};

export type PredefinedAvatar = {
  id: PredefinedAvatarId;
  label: string;
  url: string;
};

export function getPredefinedAvatarUrl(avatarId: PredefinedAvatarId): string {
  return `/api/avatars/${avatarId}`;
}

export const predefinedAvatars: PredefinedAvatar[] = predefinedAvatarIds.map(
  (id) => ({
    id,
    label: predefinedAvatarLabels[id],
    url: getPredefinedAvatarUrl(id),
  }),
);

export function isPredefinedAvatarId(
  avatarId: string,
): avatarId is PredefinedAvatarId {
  return (predefinedAvatarIds as readonly string[]).includes(avatarId);
}

export function isPredefinedAvatarUrl(url: string | null): boolean {
  if (!url) {
    return false;
  }

  return predefinedAvatars.some((avatar) => avatar.url === url);
}
