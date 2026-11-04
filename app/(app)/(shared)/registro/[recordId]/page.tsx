import { AppHeader } from "@/components/app-shell/app-header";
import { RecordDetail } from "@/components/records/record-detail";
import { RecordNoteSheet } from "@/components/records/record-note-sheet";
import { RecordPatientReply } from "@/components/records/record-patient-reply";
import { RecordReplyCard } from "@/components/records/record-reply-card";
import { RecordReplySheet } from "@/components/records/record-reply-sheet";
import { requireRecordAccess } from "@/server/auth/require-record-access";
import {
  getProfileGrammaticalGender,
  getRecordNote,
  getRecordReply,
  getRecordViews,
} from "@/server/queries";

type RecordPageProps = {
  params: Promise<{ recordId: string }>;
};

export default async function RecordPage({ params }: RecordPageProps) {
  const { recordId } = await params;
  const { profile, record } = await requireRecordAccess(recordId);
  const note =
    profile.role === "psychologist"
      ? (await getRecordNote(record.id, profile.id)) ?? null
      : null;
  const gender =
    profile.role === "patient"
      ? profile.grammaticalGender
      : await getProfileGrammaticalGender(record.patientId);
  const views = profile.role === "patient" ? await getRecordViews(recordId) : [];
  const reply = await getRecordReply(record.id);
  const ownReplyContent =
    reply?.psychologistId === profile.id ? reply.content : "";
  const patientReply = reply ? (
    <RecordPatientReply recordId={record.id} reply={reply} />
  ) : null;
  const replySlot =
    profile.role === "psychologist" ? (
      <RecordReplyCard
        title="Tu respuesta"
        content={ownReplyContent || null}
        placeholder="Escríbele unas palabras. Las verá junto a su registro."
        action={
          <RecordReplySheet recordId={record.id} initialContent={ownReplyContent} />
        }
      />
    ) : (
      patientReply
    );

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
        reply={replySlot}
      />
    </>
  );
}
