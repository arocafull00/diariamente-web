import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { logger } from "@/lib/logger";
import { logAuditEvent } from "@/server/audit";
import { isAdminApiRequest } from "@/server/auth/require-admin-api";
import { cancelSubscriptionAtPeriodEnd } from "@/server/billing/cancel-subscription";
import { getAdminBilling } from "@/server/billing/get-admin-billing";
import { setClinicPrice } from "@/server/billing/set-clinic-price";
import { adminBillingUpdateSchema } from "@/validation/schemas";

type AdminBillingRouteContext = {
  params: Promise<{ userId: string }>;
};

export async function PATCH(req: Request, { params }: AdminBillingRouteContext) {
  if (!isAdminApiRequest(req)) {
    logger.warn("admin.billing.unauthorized");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const parsed = adminBillingUpdateSchema.safeParse(
    await req.json().catch(() => null),
  );

  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const current = await getAdminBilling(userId);

  if (!current) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const adminEmail = req.headers.get("x-admin-email")?.slice(0, 200) ?? null;
  const input = parsed.data;

  try {
    if (input.action === "lifetime") {
      if (current.role !== "psychologist") {
        return Response.json(
          { error: "Only psychologists can have lifetime access" },
          { status: 400 },
        );
      }

      await db
        .update(profiles)
        .set({ lifetimeAccess: input.enabled, updatedAt: new Date() })
        .where(eq(profiles.id, userId));

      if (input.enabled) {
        await cancelSubscriptionAtPeriodEnd(userId);
      }

      await logAuditEvent({
        actorId: userId,
        action: input.enabled
          ? "billing.lifetime_granted"
          : "billing.lifetime_revoked",
        entityType: "profile",
        entityId: userId,
        metadata: { source: "urithiru", adminEmail },
      });
    }

    if (input.action === "clinic-price") {
      const { clinic } = current;

      if (!clinic) {
        return Response.json(
          { error: "Only clinic accounts can have a custom price" },
          { status: 400 },
        );
      }

      await setClinicPrice(clinic.id, input.monthlyPriceCents);

      await logAuditEvent({
        actorId: userId,
        action: "billing.clinic_price_set",
        entityType: "clinic",
        entityId: clinic.id,
        metadata: {
          source: "urithiru",
          adminEmail,
          monthlyPriceCents: input.monthlyPriceCents,
        },
      });
    }

    return Response.json({ user: await getAdminBilling(userId) });
  } catch (error) {
    logger.error("admin.billing.update_failed", error, {
      userId,
      action: input.action,
    });
    return Response.json({ error: "Billing update failed" }, { status: 500 });
  }
}
