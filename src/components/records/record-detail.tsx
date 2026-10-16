"use client";

import {
  Footprints,
  LoaderCircle,
  MapPin,
  MessageCircleMore,
  Save,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { RecordBodySection } from "@/components/records/record-body-section";
import { RecordContextSection } from "@/components/records/record-context-section";
import { RecordDetailField } from "@/components/records/record-detail-field";
import { RecordEmotionsSection } from "@/components/records/record-emotions-section";
import { RecordMoodHero } from "@/components/records/record-mood-hero";
import { RecordNotePanel } from "@/components/records/record-note-panel";
import { Button } from "@/components/ui/button";
import type { PatientRecord, Profile, RecordNote } from "@/db/schema";
import { getDominantEmotion, getRecordQuadrant } from "@/lib/emotions";
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

  const showNotePanel = isPsychologist && note;
  const quadrant = getRecordQuadrant(record);
  const pendingFields = [situation, thoughts, behaviours].filter(
    (value) => value.trim().length === 0,
  ).length;

  const recordContent = (
    <>
      <RecordMoodHero
        emotion={getDominantEmotion(record.emotions)}
        quadrant={quadrant}
        occurredAt={record.occurredAt}
      />

      <RecordContextSection context={record.context} quadrant={quadrant} />

      <RecordBodySection sensations={record.bodySensations} />

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <h2 className="font-display text-xl font-medium">Profundizar</h2>
          {pendingFields > 0 ? (
            <p className="text-xs text-muted-foreground">
              {pendingFields} {pendingFields === 1 ? "pendiente" : "pendientes"}
            </p>
          ) : null}
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/60">
          <RecordDetailField
            id="situation"
            icon={MapPin}
            label="Situación"
            placeholder="¿Qué ha pasado?"
            value={situation}
            editable={isPatient}
            onChange={setSituation}
          />
          <RecordDetailField
            id="thoughts"
            icon={MessageCircleMore}
            label="Pensamientos"
            placeholder="¿Qué pasó por tu cabeza?"
            value={thoughts}
            editable={isPatient}
            onChange={setThoughts}
          />
          <RecordDetailField
            id="behaviours"
            icon={Footprints}
            label="Conductas"
            placeholder="¿Qué hiciste?"
            value={behaviours}
            editable={isPatient}
            onChange={setBehaviours}
          />
        </div>
      </section>

      {record.emotions.length > 1 ? (
        <RecordEmotionsSection emotions={record.emotions} />
      ) : null}

      <AnimatePresence>
        {isPatient && (hasChanges || pending) ? (
          <motion.div
            key="save"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="sticky bottom-24 lg:bottom-6"
          >
            <Button
              size="lg"
              className="w-full"
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );

  if (showNotePanel) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="min-w-0 space-y-6">{recordContent}</div>
          <RecordNotePanel note={note} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 lg:mx-auto lg:max-w-3xl">
      {recordContent}
    </div>
  );
}
