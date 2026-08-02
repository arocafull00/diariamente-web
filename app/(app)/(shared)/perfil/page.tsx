import { currentUser } from "@clerk/nextjs/server";

import { AppHeader } from "@/components/app-shell/app-header";
import { PatientProfile } from "@/components/profile/patient-profile";
import { PsychologistProfile } from "@/components/profile/psychologist-profile";
import { SettingsSheet } from "@/components/profile/settings-sheet";
import { requireProfile } from "@/server/auth/get-current-profile";
import {
  getPatientPendingRequest,
  getPatientPsychologist,
  getPatientRecordCount,
  getPsychologistPatients,
  getReminderSettings,
} from "@/server/queries";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const user = await currentUser();

  if (profile.role === "patient") {
    const [psychologist, pendingRequest, recordCount, reminderSettings] =
      await Promise.all([
        getPatientPsychologist(profile.id),
        getPatientPendingRequest(profile.id),
        getPatientRecordCount(profile.id),
        getReminderSettings(profile.id),
      ]);

    const resolvedReminderSettings = reminderSettings
      ? {
          enabled: reminderSettings.enabled,
          frequency: reminderSettings.frequency,
          time: reminderSettings.time,
          days: reminderSettings.days,
        }
      : null;

    return (
      <>
        <AppHeader
          title="Perfil"
          action={
            <SettingsSheet
              role={profile.role}
              reminderSettings={resolvedReminderSettings}
            />
          }
        />
        <PatientProfile
          firstName={profile.firstName}
          lastName={profile.lastName}
          avatarUrl={profile.avatarUrl}
          imageUrl={user?.imageUrl ?? null}
          memberSince={profile.createdAt}
          recordCount={recordCount}
          psychologist={psychologist}
          pendingRequest={pendingRequest}
          reminderSettings={resolvedReminderSettings}
        />
      </>
    );
  }

  const patients = await getPsychologistPatients(profile.id);

  return (
    <>
      <AppHeader
        title="Perfil"
        action={
          <SettingsSheet role={profile.role!} reminderSettings={null} />
        }
      />
      <PsychologistProfile
        firstName={profile.firstName}
        lastName={profile.lastName}
        avatarUrl={profile.avatarUrl}
        imageUrl={user?.imageUrl ?? null}
        memberSince={profile.createdAt}
        patientCount={patients.length}
      />
    </>
  );
}
