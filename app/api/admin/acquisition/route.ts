import { z } from "zod";
import { isAdminApiRequest } from "@/server/auth/require-admin-api";
import { getSignupSummary, getUsersSignupAttribution } from "@/server/queries/signup-acquisition";
import { adminBillingIdsSchema } from "@/validation/schemas";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store", Vary: "Authorization" };
  if (!isAdminApiRequest(request)) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  const params = new URL(request.url).searchParams;
  const ids = params.get("ids");
  try {
    if (ids !== null) {
      const parsed = adminBillingIdsSchema.safeParse(ids.split(","));
      if (!parsed.success) return Response.json({ error: "Invalid ids" }, { status: 400, headers });
      return Response.json({ users: await getUsersSignupAttribution(parsed.data) }, { headers });
    }
    const period = z.enum(["0", "1", "7", "30"]).safeParse(params.get("period") ?? "7");
    if (!period.success) return Response.json({ error: "Invalid period" }, { status: 400, headers });
    return Response.json({ rows: await getSignupSummary(Number(period.data)) }, { headers });
  } catch {
    return Response.json({ error: "Acquisition unavailable" }, { status: 500, headers });
  }
}
