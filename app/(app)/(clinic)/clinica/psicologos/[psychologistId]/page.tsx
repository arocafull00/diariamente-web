import { AppHeader } from "@/components/app-shell/app-header";
import { ClinicPsychologistSummary } from "@/components/clinics/clinic-psychologist-summary";
import { ClinicRemovePsychologistButton } from "@/components/clinics/clinic-remove-psychologist-button";
import { ClinicStatCard } from "@/components/clinics/clinic-stat-card";
import type { MoodQuadrant } from "@/db/schema";
import { getFullName } from "@/lib/utils-app";
import { requireClinicPsychologist } from "@/server/auth/require-clinic";

type ClinicPsychologistPageProps = {
  params: Promise<{ psychologistId: string }>;
};

export default async function ClinicPsychologistPage({
  params,
}: ClinicPsychologistPageProps) {
  const { psychologistId } = await params;
  const { psychologist } = await requireClinicPsychologist(psychologistId);
  const fullName = getFullName(psychologist.firstName, psychologist.lastName);

  const stats: { label: string; value: number; quadrant: MoodQuadrant }[] = [
    { label: "Pacientes", value: psychologist.patients, quadrant: "HIGH_PLEASANT" },
    { label: "Altas en 30 días", value: psychologist.newPatients, quadrant: "LOW_PLEASANT" },
    { label: "Registros en 7 días", value: psychologist.records7d, quadrant: "HIGH_UNPLEASANT" },
    { label: "Registros en 30 días", value: psychologist.records30d, quadrant: "HIGH_UNPLEASANT" },
    { label: "Revisados en 30 días", value: psychologist.reviewed30d, quadrant: "LOW_PLEASANT" },
    { label: "Sesiones en 30 días", value: psychologist.sessions30d, quadrant: "HIGH_PLEASANT" },
    { label: "Pacientes inactivos", value: psychologist.inactivePatients, quadrant: "LOW_UNPLEASANT" },
  ];

  return (
    <>
      <AppHeader title={fullName} showBack />
      <div className="space-y-6">
        <ClinicPsychologistSummary
          firstName={psychologist.firstName}
          lastName={psychologist.lastName}
          avatarUrl={psychologist.avatarUrl}
          joinedAt={psychologist.joinedAt}
          lastActiveAt={psychologist.lastActiveAt}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat) => (
            <ClinicStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              quadrant={stat.quadrant}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Métricas agregadas. Los registros, notas y datos de los pacientes son
          privados entre cada paciente y su profesional.
        </p>
        <ClinicRemovePsychologistButton
          psychologistId={psychologist.id}
          psychologistName={fullName}
        />
      </div>
    </>
  );
}
