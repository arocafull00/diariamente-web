"use client";

import { AppHeader } from "@/components/app-shell/app-header";
import { AppLoading } from "@/components/app-shell/app-loading";
import { ClinicProfile } from "@/components/profile/clinic-profile";
import { PatientProfile } from "@/components/profile/patient-profile";
import { PsychologistProfile } from "@/components/profile/psychologist-profile";
import { SettingsSheet } from "@/components/profile/settings-sheet";
import { useCachedScreen } from "@/hooks/use-cached-screen";
import { getProfileScreenData } from "@/server/actions/screen-data";

type ProfileScreenProps = {
  refreshedAt: number;
};

export function ProfileScreen({ refreshedAt }: ProfileScreenProps) {
  const { data, hasHydrated } = useCachedScreen(
    "profile",
    getProfileScreenData,
    refreshedAt,
  );

  if (!hasHydrated) {
    return <AppHeader title="Perfil" />;
  }

  if (!data) {
    return (
      <>
        <AppHeader title="Perfil" />
        <AppLoading />
      </>
    );
  }

  if (data.role === "patient") {
    return (
      <>
        <AppHeader
          title="Perfil"
          action={
            <SettingsSheet
              role={data.role}
              remindersEnabled={data.remindersEnabled}
              grammaticalGender={data.grammaticalGender}
            />
          }
        />
        <PatientProfile
          firstName={data.firstName}
          lastName={data.lastName}
          avatarUrl={data.avatarUrl}
          imageUrl={data.imageUrl}
          memberSince={data.memberSince}
          recordCount={data.recordCount}
          psychologist={data.psychologist}
          pendingRequest={data.pendingRequest}
        />
      </>
    );
  }

  if (data.role === "clinic") {
    return (
      <>
        <AppHeader
          title="Perfil"
          action={
            <SettingsSheet
              role={data.role}
              remindersEnabled={false}
              grammaticalGender={data.grammaticalGender}
              subscription={{ billing: data.billing }}
            />
          }
        />
        <ClinicProfile
          firstName={data.firstName}
          lastName={data.lastName}
          avatarUrl={data.avatarUrl}
          imageUrl={data.imageUrl}
          memberSince={data.memberSince}
          clinicName={data.clinicName}
          psychologistCount={data.psychologistCount}
        />
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Perfil"
        action={
          <SettingsSheet
            role={data.role}
            remindersEnabled={false}
            grammaticalGender={data.grammaticalGender}
            subscription={
              data.role === "psychologist"
                ? { billing: data.billing, referral: data.referral }
                : undefined
            }
          />
        }
      />
      <PsychologistProfile
        firstName={data.firstName}
        lastName={data.lastName}
        avatarUrl={data.avatarUrl}
        imageUrl={data.imageUrl}
        memberSince={data.memberSince}
        patientCount={data.patientCount}
        clinic={data.clinic}
      />
    </>
  );
}
