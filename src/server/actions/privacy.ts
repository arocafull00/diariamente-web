"use server";

import { logAuditEvent } from "@/server/audit";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getDataExport } from "@/server/queries";

export async function exportMyData() {
  const profile = await requireProfile();
  const data = await getDataExport(profile.id);

  await logAuditEvent({
    actorId: profile.id,
    action: "data.exported",
    entityType: "profile",
    entityId: profile.id,
    metadata: { format: "json" },
  });

  return data;
}
