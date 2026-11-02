import { FaceRow } from "@/components/faces/face-row";
import type { MoodQuadrant } from "@/db/schema";

import { ClinicStatCard } from "./clinic-stat-card";

type ClinicOverviewProps = {
  psychologists: number;
  patients: number;
  newPatients: number;
  records30d: number;
  inactivePatients: number;
};

export function ClinicOverview({
  psychologists,
  patients,
  newPatients,
  records30d,
  inactivePatients,
}: ClinicOverviewProps) {
  const stats: { label: string; value: number; quadrant: MoodQuadrant }[] = [
    { label: "Altas en 30 días", value: newPatients, quadrant: "LOW_PLEASANT" },
    { label: "Registros en 30 días", value: records30d, quadrant: "HIGH_PLEASANT" },
    { label: "Pacientes inactivos", value: inactivePatients, quadrant: "LOW_UNPLEASANT" },
  ];

  return (
    <section className="space-y-6 rounded-[2rem] bg-card/80 px-4 py-6 shadow-sm ring-1 ring-border/50 backdrop-blur sm:px-6 lg:px-10 lg:py-8">
      <div className="space-y-3 text-center">
        <FaceRow faceIds={["04_naranja_amarillo", "alegria", "02_azul_rosa"]} />
        <h2 className="font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
          {psychologists} {psychologists === 1 ? "psicólogo/a acompaña" : "psicólogos/as acompañan"} a{" "}
          <span className="text-mood-lp-strong italic">
            {patients} {patients === 1 ? "paciente" : "pacientes"}
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <ClinicStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            quadrant={stat.quadrant}
          />
        ))}
      </div>
    </section>
  );
}
