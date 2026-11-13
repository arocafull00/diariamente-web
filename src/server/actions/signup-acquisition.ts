"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { signupAttribution } from "@/db/schema";
import { readSignupOrigin, signupPlatformSchema, SIGNUP_ACQUISITION_COOKIE, SIGNUP_ACQUISITION_WINDOW } from "@/lib/signup-acquisition";
import { ensureProfile } from "@/server/profiles/ensure-profile";

export async function saveSignupAttribution(input: unknown): Promise<{ success?: true; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Sesión no disponible" };
  const platform = signupPlatformSchema.safeParse(input);
  if (!platform.success) return { error: "Plataforma no válida" };
  try {
    const [client, cookieStore] = await Promise.all([clerkClient(), cookies()]);
    const user = await client.users.getUser(userId);
    if (Date.now() - user.createdAt > SIGNUP_ACQUISITION_WINDOW) return { success: true };
    const origin = readSignupOrigin(cookieStore.get(SIGNUP_ACQUISITION_COOKIE)?.value);
    const validOrigin = origin && origin.capturedAt <= user.createdAt ? origin : null;
    if (!validOrigin) return { success: true };
    await ensureProfile(userId, user.imageUrl);
    const inserted = await db.insert(signupAttribution).values({
      profileId: userId,
      channel: validOrigin.channel,
      platform: platform.data,
      landingHost: validOrigin.landingHost,
      registeredAt: new Date(user.createdAt),
    }).onConflictDoNothing().returning({ profileId: signupAttribution.profileId });
    if (inserted.length) revalidatePath("/api/admin/acquisition");
    return { success: true };
  } catch {
    return { error: "No se ha podido guardar el origen del alta" };
  }
}
