import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { RecordCard } from "@/components/records/record-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireRole } from "@/server/auth/get-current-profile";
import { getPatientRecords } from "@/server/queries";

export default async function MyRecordsPage() {
  const profile = await requireRole("patient");
  const records = await getPatientRecords(profile.id);

  return (
    <>
      <AppHeader title="Mis registros" />
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="rounded-lg bg-secondary p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no tienes registros.
            </p>
            <Link href="/nuevo-registro" className={cn(buttonVariants(), "mt-4")}>
              Crear primer registro
            </Link>
          </div>
        ) : (
          records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              href={`/registro/${record.id}`}
            />
          ))
        )}
      </div>
    </>
  );
}
