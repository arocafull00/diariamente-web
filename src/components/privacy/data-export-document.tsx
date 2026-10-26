import { getPsychologistNoun } from "@/lib/grammatical-gender";
import { formatRecordDate, getFullName, getRoleLabel } from "@/lib/utils-app";
import type { getDataExport } from "@/server/queries";

import { DataExportField } from "./data-export-field";
import { DataExportListItem } from "./data-export-list-item";
import { DataExportRecord } from "./data-export-record";
import { DataExportSection } from "./data-export-section";

const REQUEST_STATUS_LABELS = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
} as const;

type DataExportDocumentProps = {
  data: Awaited<ReturnType<typeof getDataExport>>;
};

export function DataExportDocument({ data }: DataExportDocumentProps) {
  const { profile } = data;
  const gender = profile?.grammaticalGender ?? "unspecified";
  const isPatient = profile?.role === "patient";

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-medium">Mis datos en DiariaMente</h1>
        <p className="text-sm text-muted-foreground">
          Copia generada el {formatRecordDate(data.exportedAt)}
        </p>
      </header>

      <DataExportSection title="Perfil" empty={!profile}>
        {profile ? (
          <dl className="space-y-1.5">
            <DataExportField
              label="Nombre"
              value={getFullName(profile.firstName, profile.lastName)}
            />
            <DataExportField
              label="Rol"
              value={profile.role ? getRoleLabel(profile.role) : ""}
            />
            <DataExportField
              label="Miembro desde"
              value={formatRecordDate(profile.createdAt)}
            />
            <DataExportField
              label="Última actividad"
              value={formatRecordDate(profile.lastActiveAt)}
            />
            {isPatient ? (
              <DataExportField
                label="Recordatorio diario"
                value={data.reminders.enabled ? "Activado" : "Desactivado"}
              />
            ) : null}
          </dl>
        ) : null}
      </DataExportSection>

      <DataExportSection
        title={isPatient ? "Profesional vinculado" : "Pacientes vinculados"}
        empty={data.links.length === 0}
      >
        <ul className="divide-y divide-border">
          {data.links.map((link) => (
            <DataExportListItem
              key={`${link.with}-${link.linkedAt.toISOString()}`}
              title={link.with}
              detail={`Desde el ${formatRecordDate(link.linkedAt)}`}
            />
          ))}
        </ul>
      </DataExportSection>

      <DataExportSection
        title="Solicitudes de conexión"
        empty={data.connectionRequests.length === 0}
      >
        <ul className="divide-y divide-border">
          {data.connectionRequests.map((request) => (
            <DataExportListItem
              key={`${request.with}-${request.createdAt.toISOString()}`}
              title={`${request.with} · ${REQUEST_STATUS_LABELS[request.status]}`}
              detail={
                request.consentedAt
                  ? `Consentimiento el ${formatRecordDate(request.consentedAt)}`
                  : formatRecordDate(request.createdAt)
              }
            />
          ))}
        </ul>
      </DataExportSection>

      <DataExportSection
        title="Sesiones de terapia"
        empty={data.therapySessions.length === 0}
      >
        <ul className="divide-y divide-border">
          {data.therapySessions.map((session) => (
            <DataExportListItem
              key={`${session.with}-${session.heldAt.toISOString()}`}
              title={session.with}
              detail={formatRecordDate(session.heldAt)}
            />
          ))}
        </ul>
      </DataExportSection>

      {isPatient ? (
        <>
          <DataExportSection
            title={`Registros (${data.records.length})`}
            empty={data.records.length === 0}
          >
            <div className="space-y-3">
              {data.records.map((record) => (
                <DataExportRecord key={record.id} record={record} gender={gender} />
              ))}
            </div>
          </DataExportSection>

          <DataExportSection
            title="Historial de accesos"
            empty={data.accessLog.length === 0}
          >
            <ul className="divide-y divide-border">
              {data.accessLog.map((entry) => (
                <DataExportListItem
                  key={entry.id}
                  title={`Tu ${getPsychologistNoun(entry.grammaticalGender)} ${getFullName(entry.firstName, entry.lastName)}`}
                  detail={`Vio el registro del ${formatRecordDate(entry.recordOccurredAt)} el ${formatRecordDate(entry.viewedAt)}`}
                />
              ))}
            </ul>
          </DataExportSection>
        </>
      ) : (
        <DataExportSection
          title="Notas sobre registros"
          empty={data.recordNotes.length === 0}
        >
          <ul className="divide-y divide-border">
            {data.recordNotes.map((note) => (
              <DataExportListItem
                key={note.recordId}
                title={note.content}
                detail={formatRecordDate(note.updatedAt)}
              />
            ))}
          </ul>
        </DataExportSection>
      )}
    </div>
  );
}
