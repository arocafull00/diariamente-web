import { BookOpenText } from "lucide-react";

import { AppHeader } from "@/components/app-shell/app-header";
import { NewRecordHeaderButton } from "@/components/app-shell/new-record-header-button";
import { RecordCard } from "@/components/records/record-card";
import { requireRole } from "@/server/auth/get-current-profile";
import { getPatientRecords } from "@/server/queries";

export default async function MyRecordsPage() {
  const profile = await requireRole("patient");
  const records = await getPatientRecords(profile.id);

  return (
    <>
      <AppHeader title="Mis registros" action={<NewRecordHeaderButton />} />
      <div className="space-y-4">
        {records.length === 0 ? (
          <section className="rounded-xl bg-secondary p-6 text-center shadow-sm">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BookOpenText className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-semibold">Tu espacio está listo</h2>
            <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
              Crea tu primer registro para empezar a recoger lo que ocurre entre
              sesiones.
            </p>
          </section>
        ) : (
          <>
            <p className="px-1 text-sm font-medium text-muted-foreground">
              {records.length} {records.length === 1 ? "registro" : "registros"}
            </p>
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  href={`/registro/${record.id}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
