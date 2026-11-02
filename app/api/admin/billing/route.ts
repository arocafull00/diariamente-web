import { logger } from "@/lib/logger";
import { isAdminApiRequest } from "@/server/auth/require-admin-api";
import { getAdminBilling } from "@/server/billing/get-admin-billing";
import { adminBillingIdsSchema } from "@/validation/schemas";

export async function GET(req: Request) {
  if (!isAdminApiRequest(req)) {
    logger.warn("admin.billing.unauthorized");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ids = new URL(req.url).searchParams.get("ids")?.split(",") ?? [];
  const parsed = adminBillingIdsSchema.safeParse(ids);

  if (!parsed.success) {
    return Response.json({ error: "Invalid ids" }, { status: 400 });
  }

  try {
    const users = await Promise.all(parsed.data.map(getAdminBilling));

    return Response.json(
      { users: users.filter((user) => user !== null) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    logger.error("admin.billing.fetch_failed", error);
    return Response.json({ error: "Billing fetch failed" }, { status: 500 });
  }
}
