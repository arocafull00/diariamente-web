import { clerkClient } from "@clerk/nextjs/server";

type ProfileWithAvatar = {
  id: string;
  avatarUrl: string | null;
};

export async function resolveAvatarUrls<T extends ProfileWithAvatar>(
  items: T[],
): Promise<T[]> {
  const missingIds = items
    .filter((item) => !item.avatarUrl)
    .map((item) => item.id);

  if (missingIds.length === 0) {
    return items;
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({
    userId: missingIds,
    limit: missingIds.length,
  });
  const imageMap = new Map(
    users.map((user) => [user.id, user.imageUrl ?? null]),
  );

  return items.map((item) => ({
    ...item,
    avatarUrl: item.avatarUrl ?? imageMap.get(item.id) ?? null,
  }));
}
