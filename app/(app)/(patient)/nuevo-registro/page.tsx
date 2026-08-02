import { AppHeader } from "@/components/app-shell/app-header";
import { NewRecordWizard } from "@/components/records/new-record-wizard";
import { requireRole } from "@/server/auth/get-current-profile";
import { getCustomEmotions } from "@/server/queries";

export default async function NewRecordPage() {
  const profile = await requireRole("patient");
  const customEmotions = await getCustomEmotions(profile.id);

  return (
    <>
      <AppHeader title="Nuevo registro" showBack />
      <NewRecordWizard
        customEmotions={customEmotions.map((emotion) => emotion.name)}
      />
    </>
  );
}
