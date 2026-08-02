import { SettingsForm } from "@/components/profile/settings-form";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getReminderSettings } from "@/server/actions/reminders";

export default async function SettingsPage() {
  const profile = await requireProfile();
  const reminderSettings = await getReminderSettings(profile.id);

  return (
    <SettingsForm
      role={profile.role!}
      reminderSettings={
        reminderSettings
          ? {
              enabled: reminderSettings.enabled,
              frequency: reminderSettings.frequency,
              time: reminderSettings.time,
              days: reminderSettings.days,
            }
          : null
      }
    />
  );
}
