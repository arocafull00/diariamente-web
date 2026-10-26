import { AppHeader } from "@/components/app-shell/app-header";
import { RecordDetail } from "@/components/records/record-detail";
import { RecordNoteSheet } from "@/components/records/record-note-sheet";
import { requireRecordAccess } from "@/server/auth/require-record-access";
import {
  getProfileGrammaticalGender,
  getRecordNote,
  getRecordViews,
} from "@/server/queries";

type RecordPageProps = {
  params: Promise<{ recordId: string }>;
};

export default async function RecordPage({ params }: RecordPageProps) {
  const { recordId } = await params;
  const { profile, record } = await requireRecordAccess(recordId);
  const note =
    profile.role === "psychologist" ? (await getRecordNote(recordId)) ?? null : null;
  const gender =
    profile.role === "patient"
      ? profile.grammaticalGender
      : await getProfileGrammaticalGender(record.patientId);
  const views = profile.role === "patient" ? await getRecordViews(recordId) : [];

  return (
    <>
      <AppHeader
        title="Detalle del registro"
        showBack
        action={
          profile.role === "psychologist" ? (
            <RecordNoteSheet recordId={recordId} note={note} />
          ) : undefined
        }
      />
      <RecordDetail
        profile={profile}
        record={record}
        note={note}
        gender={gender}
        views={views}
      />
    </>
  );
}
