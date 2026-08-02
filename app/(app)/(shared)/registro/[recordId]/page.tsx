import { AppHeader } from "@/components/app-shell/app-header";
import { RecordDetail } from "@/components/records/record-detail";
import { requireRecordAccess } from "@/server/auth/require-record-access";

type RecordPageProps = {
  params: Promise<{ recordId: string }>;
};

export default async function RecordPage({ params }: RecordPageProps) {
  const { recordId } = await params;
  const { profile, record } = await requireRecordAccess(recordId);

  return (
    <>
      <AppHeader
        title="Detalle del registro"
        showBack
      />
      <RecordDetail profile={profile} record={record} />
    </>
  );
}
