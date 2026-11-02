"use client";

import { AppHeader } from "@/components/app-shell/app-header";
import { AppLoading } from "@/components/app-shell/app-loading";
import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";
import { useCachedScreen } from "@/hooks/use-cached-screen";
import { getClinicScreenData } from "@/server/actions/screen-data";

import { ClinicEmptyState } from "./clinic-empty-state";
import { ClinicInviteSheet } from "./clinic-invite-sheet";
import { ClinicOverview } from "./clinic-overview";
import { ClinicPsychologistCard } from "./clinic-psychologist-card";

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

  return (
    <>
      <AppHeader
        title={TITLE}
        centerLabel={data.clinicName}
        action={<ClinicInviteSheet token={data.inviteToken} origin={origin} />}
      />
      <div className="space-y-6">
        {data.psychologists.length === 0 ? (
          <ClinicEmptyState token={data.inviteToken} origin={origin} />
        ) : (
          <>
            <ClinicOverview
              psychologists={data.psychologists.length}
              patients={data.totals.patients}
              newPatients={data.totals.newPatients}
              records30d={data.totals.records30d}
              inactivePatients={data.totals.inactivePatients}
            />
            <section className="space-y-3">
              <h2 className="px-1 font-semibold">Psicólogos/as</h2>
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
            </section>
          </>
        )}
      </div>
    </>
  );
}
