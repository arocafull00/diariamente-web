"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { INVITE_COOKIE_NAME } from "@/lib/invitations";
import { logAuditEvent } from "@/server/audit";
import { requireUser } from "@/server/auth/get-current-profile";
import { onboardingSchema } from "@/validation/schemas";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function completeOnboarding(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await requireUser();

  const parsed = onboardingSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { firstName, lastName, role } = parsed.data;

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  await db
    .insert(profiles)
    .values({
      id: userId,
      firstName,
      lastName,
      role,
      avatarUrl: clerkUser.imageUrl ?? null,
      onboardingCompleted: true,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        firstName,
        lastName,
        role,
        avatarUrl: clerkUser.imageUrl ?? null,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
    });

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role },
  });

  if (role === "patient") {
    const cookieStore = await cookies();

    if (cookieStore.get(INVITE_COOKIE_NAME)?.value) {
      redirect("/conectar");
    }

    redirect("/inicio");
  }

  redirect("/pacientes");
}

export async function deleteAccount(): Promise<ActionResult> {
  const userId = await requireUser();

  await logAuditEvent({
    actorId: userId,
    action: "account.deleted",
    entityType: "profile",
    entityId: userId,
  });

  await db.delete(profiles).where(eq(profiles.id, userId));

  const client = await clerkClient();
  await client.users.deleteUser(userId);

  revalidatePath("/");
  redirect("/login");
}
