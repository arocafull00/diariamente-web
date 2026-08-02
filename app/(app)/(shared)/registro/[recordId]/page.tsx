import { RecordDetail } from "@/components/records/record-detail";
import { requireRecordAccess } from "@/server/auth/require-record-access";

type RecordPageProps = {
  params: Promise<{ recordId: string }>;
};

export default async function RecordPage({ params }: RecordPageProps) {
  const { recordId } = await params;
  const { profile, record } = await requireRecordAccess(recordId);

  return <RecordDetail profile={profile} record={record} />;
}
