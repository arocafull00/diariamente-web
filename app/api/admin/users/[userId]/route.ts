import { z } from "zod";

import { logger } from "@/lib/logger";
import { isAdminApiRequest } from "@/server/auth/require-admin-api";
import { deleteProfileAndIdentity } from "@/server/profiles/delete-profile";

const userIdSchema = z.string().regex(/^user_[A-Za-z0-9]+$/).max(100);

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  if (!isAdminApiRequest(request)) {
    logger.warn("admin.account_delete.unauthorized");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    process.env.VERCEL_ENV !== "production" ||
    !process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
  ) {
    return Response.json({ error: "Production required" }, { status: 503 });
  }

  const { userId } = await params;
  if (!userIdSchema.safeParse(userId).success) {
    return Response.json({ error: "Invalid user" }, { status: 400 });
  }

  try {
    await deleteProfileAndIdentity(userId, { revokeSessions: true });
    logger.info("admin.account_delete.completed", {
      adminId: request.headers.get("x-admin-id")?.slice(0, 100),
    });
    return Response.json({ deleted: true });
  } catch (error) {
    logger.error("admin.account_delete.failed", error);
    return Response.json({ error: "Account deletion failed" }, { status: 500 });
  }
}
