"use client";

import {
  Footprints,
  LoaderCircle,
  MapPin,
  MessageCircleMore,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { RecordDetailField } from "@/components/records/record-detail-field";
import { RecordEmotionsSection } from "@/components/records/record-emotions-section";
import { RecordNoteSection } from "@/components/records/record-note-section";
import { RecordSummary } from "@/components/records/record-summary";
import { Button } from "@/components/ui/button";
import type { PatientRecord, Profile, RecordNote } from "@/db/schema";
import {
  markRecordAsSeen,
  updatePatientRecord,
} from "@/server/actions/records";

type RecordDetailProps = {
  profile: Profile;
  record: PatientRecord;
  note: RecordNote | null;
};

export function RecordDetail({ profile, record, note }: RecordDetailProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [situation, setSituation] = useState(record.situation);
  const [thoughts, setThoughts] = useState(record.thoughts);
  const [behaviours, setBehaviours] = useState(record.behaviours);
  const isPatient = profile.role === "patient";
  const isPsychologist = profile.role === "psychologist";
  const hasChanges =
    situation !== record.situation ||
    thoughts !== record.thoughts ||
    behaviours !== record.behaviours;

  useEffect(() => {
    if (!isPsychologist || record.seenAt) {
      return;
    }

    void markRecordAsSeen(record.id);
  }, [isPsychologist, record.id, record.seenAt]);

  function handleSave() {
    startTransition(async () => {
      const result = await updatePatientRecord(record.id, {
        situation,
        thoughts,
        behaviours,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Registro actualizado");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 lg:mx-auto lg:w-full lg:max-w-3xl">
      <RecordSummary
        occurredAt={record.occurredAt}
        intensity={record.emotionIntensity}
      />

      <section className="divide-y divide-border overflow-hidden rounded-xl bg-card shadow-sm">
        <RecordDetailField
          id="situation"
          icon={MapPin}
          label="Situación"
          value={situation}
          editable={isPatient}
          onChange={setSituation}
        />
        <RecordDetailField
          id="thoughts"
          icon={MessageCircleMore}
          label="Pensamientos"
          value={thoughts}
          editable={isPatient}
          onChange={setThoughts}
        />
        <RecordDetailField
          id="behaviours"
          icon={Footprints}
          label="Conductas"
          value={behaviours}
          editable={isPatient}
          onChange={setBehaviours}
        />
      </section>

      <RecordEmotionsSection emotions={record.emotions} />

      {isPsychologist ? (
        <RecordNoteSection recordId={record.id} note={note} />
      ) : null}

      {isPatient && (hasChanges || pending) ? (
        <Button
          size="lg"
          className="w-full rounded-xl shadow-sm"
          disabled={pending}
          onClick={handleSave}
        >
          {pending ? (
            <LoaderCircle
              className="animate-spin"
              data-icon="inline-start"
              aria-hidden="true"
            />
          ) : (
            <Save data-icon="inline-start" aria-hidden="true" />
          )}
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
      ) : null}
    </div>
  );
}
