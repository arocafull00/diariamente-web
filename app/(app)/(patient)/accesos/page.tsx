import { AppHeader } from "@/components/app-shell/app-header";
import { AccessLogList } from "@/components/privacy/access-log-list";
import { requireRole } from "@/server/auth/get-current-profile";
import { getRecordAccessLog } from "@/server/queries";

export default async function AccessLogPage() {
  const profile = await requireRole("patient");
  const entries = await getRecordAccessLog(profile.id);

  return (
    <>
      <AppHeader title="Historial de accesos" showBack />
      <div className="space-y-4">
        <p className="px-1 text-sm text-muted-foreground">
          Cada vez que tu profesional abre uno de tus registros queda anotado
          aquí, aunque ya no estéis vinculados.
        </p>
        <AccessLogList entries={entries} />
      </div>
    </>
  );
}
