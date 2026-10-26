import type { Metadata } from "next";

import { DataExportActions } from "@/components/privacy/data-export-actions";
import { DataExportDocument } from "@/components/privacy/data-export-document";
import { logAuditEvent } from "@/server/audit";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getDataExport } from "@/server/queries";

export const metadata: Metadata = {
  title: "Mis datos · DiariaMente",
  robots: { index: false },
};

export default async function DataExportPage() {
  const profile = await requireProfile();
  const data = await getDataExport(profile.id);

  await logAuditEvent({
    actorId: profile.id,
    action: "data.exported",
    entityType: "profile",
    entityId: profile.id,
    metadata: { format: "pdf" },
  });

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl space-y-6 bg-background px-4 py-8 print:max-w-none print:px-0 print:py-0">
      <DataExportActions />
      <DataExportDocument data={data} />
    </div>
  );
}
