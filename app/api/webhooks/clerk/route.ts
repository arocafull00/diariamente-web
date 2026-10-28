import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { isPredefinedAvatarUrl } from "@/lib/avatars";
import { logger } from "@/lib/logger";
import { ensureProfile } from "@/server/profiles/ensure-profile";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!webhookSecret) {
    logger.error(
      "webhooks.clerk.missing_secret",
      new Error("CLERK_WEBHOOK_SIGNING_SECRET is not configured"),
    );
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn("webhooks.clerk.missing_headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    logger.warn("webhooks.clerk.invalid_signature", {
      svixId,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "user.created") {
      await ensureProfile(event.data.id, event.data.image_url ?? null);
      logger.info("auth.signup.profile_created", { userId: event.data.id });
    }

    if (event.type === "user.updated") {
      const [current] = await db
        .select({ avatarUrl: profiles.avatarUrl })
        .from(profiles)
        .where(eq(profiles.id, event.data.id))
        .limit(1);

      if (!isPredefinedAvatarUrl(current?.avatarUrl ?? null)) {
        await db
          .update(profiles)
          .set({
            avatarUrl: event.data.image_url ?? null,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, event.data.id));
      }
    }
  } catch (error) {
    logger.error("webhooks.clerk.handler_failed", error, {
      eventType: event.type,
      svixId,
    });
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
