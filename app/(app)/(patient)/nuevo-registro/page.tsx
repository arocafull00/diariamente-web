import { NewRecordWizard } from "@/components/records/new-record-wizard";
import { requireRole } from "@/server/auth/get-current-profile";

export default async function NewRecordPage() {
  const profile = await requireRole("patient");

  return <NewRecordWizard bodyFigure={profile.bodyFigure} />;
}
