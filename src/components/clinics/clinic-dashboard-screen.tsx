"use client";

import { Activity, BookOpen, Moon, UserPlus, Users } from "lucide-react";

import { AppHeader } from "@/components/app-shell/app-header";
import { AppLoading } from "@/components/app-shell/app-loading";
import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";
import { useCachedScreen } from "@/hooks/use-cached-screen";
import { getClinicScreenData } from "@/server/actions/screen-data";

import { ClinicEmptyState } from "./clinic-empty-state";
import { ClinicInviteSheet } from "./clinic-invite-sheet";
import { ClinicPsychologistCard } from "./clinic-psychologist-card";
import { ClinicStatCard } from "./clinic-stat-card";

type ClinicDashboardScreenProps = {
  refreshedAt: number;
  origin: string;
};

const TITLE = "Equipo";

export function ClinicDashboardScreen({
  refreshedAt,
  origin,
}: ClinicDashboardScreenProps) {
  const { data, hasHydrated } = useCachedScreen(
    "clinic",
    getClinicScreenData,
    refreshedAt,
  );

  if (!hasHydrated) {
    return <AppHeader title={TITLE} />;
  }

  if (!data) {
    return (
      <>
        <AppHeader title={TITLE} />
        <AppLoading />
      </>
    );
  }

  const stats = [
    { label: "Psicólogos/as", value: data.psychologists.length, icon: Users },
    { label: "Pacientes", value: data.totals.patients, icon: Activity },
    { label: "Altas (30 días)", value: data.totals.newPatients, icon: UserPlus },
    { label: "Registros (30 días)", value: data.totals.records30d, icon: BookOpen },
    {
      label: "Pacientes inactivos",
      value: data.totals.inactivePatients,
      icon: Moon,
    },
  ];

  return (
    <>
      <AppHeader
        title={TITLE}
        eyebrow={data.clinicName}
        action={<ClinicInviteSheet token={data.inviteToken} origin={origin} />}
      />
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {stats.map((stat) => (
            <ClinicStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
        {data.psychologists.length === 0 ? (
          <ClinicEmptyState token={data.inviteToken} origin={origin} />
        ) : (
          <StaggerList className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {data.psychologists.map((psychologist) => (
              <StaggerItem key={psychologist.id}>
                <ClinicPsychologistCard
                  id={psychologist.id}
                  firstName={psychologist.firstName}
                  lastName={psychologist.lastName}
                  avatarUrl={psychologist.avatarUrl}
                  patients={psychologist.patients}
                  records7d={psychologist.records7d}
                  lastActiveAt={psychologist.lastActiveAt}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    </>
  );
}
