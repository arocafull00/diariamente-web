"use client";

import {
  Footprints,
  LoaderCircle,
  MapPin,
  MessageCircleMore,
  Save,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { RecordAccessNotice } from "@/components/records/record-access-notice";
import { RecordBodyEditor } from "@/components/records/record-body-editor";
import { RecordBodySection } from "@/components/records/record-body-section";
import { RecordContextSection } from "@/components/records/record-context-section";
import { RecordDetailField } from "@/components/records/record-detail-field";
import { RecordEditButton } from "@/components/records/record-edit-button";
import { RecordEmotionEditor } from "@/components/records/record-emotion-editor";
import { RecordEmotionsSection } from "@/components/records/record-emotions-section";
import { RecordMoodHero } from "@/components/records/record-mood-hero";
import { RecordNotePanel } from "@/components/records/record-note-panel";
import { useRecordEdit } from "@/components/records/use-record-edit";
import { Button } from "@/components/ui/button";
import type {
  GrammaticalGender,
  PatientRecord,
  Profile,
  RecordNote,
} from "@/db/schema";
import { getEditableSensations } from "@/lib/body-sensations";
import { getDominantEmotion, getRecordQuadrant } from "@/lib/emotions";
import { markRecordAsSeen } from "@/server/actions/records";

type RecordDetailProps = {
  profile: Profile;
  record: PatientRecord;
  note: RecordNote | null;
  gender: GrammaticalGender;
  views: React.ComponentProps<typeof RecordAccessNotice>["views"];
};

export function RecordDetail({
  profile,
  record,
  note,
  gender,
  views,
}: RecordDetailProps) {
  const edit = useRecordEdit(record);
  const [openEditor, setOpenEditor] = useState<"emotion" | "body" | null>(null);
  const { situation, thoughts, behaviours, pending, hasChanges } = edit;
  const isPatient = profile.role === "patient";
  const isPsychologist = profile.role === "psychologist";

  useEffect(() => {
    if (!isPsychologist) {
      return;
    }

    void markRecordAsSeen(record.id);
  }, [isPsychologist, record.id]);

  const showNotePanel = isPsychologist && note;
  const quadrant = getRecordQuadrant(edit);
  const dominantEmotion = getDominantEmotion(edit.emotions);
  const pendingFields = [situation, thoughts, behaviours].filter(
    (value) => value.trim().length === 0,
  ).length;

  const recordContent = (
    <>
      <RecordMoodHero
        emotion={dominantEmotion}
        quadrant={quadrant}
        occurredAt={record.occurredAt}
        gender={gender}
        action={
          isPatient ? (
            <RecordEditButton
              label="Editar emoción"
              onClick={() => setOpenEditor("emotion")}
            />
          ) : null
        }
      />

      {isPatient ? <RecordAccessNotice views={views} /> : null}

      <RecordContextSection
        context={record.context}
        quadrant={quadrant}
        gender={gender}
      />

      <RecordBodySection
        sensations={edit.bodySensations}
        action={
          isPatient ? (
            <RecordEditButton label="Editar" onClick={() => setOpenEditor("body")} />
          ) : null
        }
      />

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
            onChange={edit.setSituation}
          />
          <RecordDetailField
            id="thoughts"
            icon={MessageCircleMore}
            label="Pensamientos"
            placeholder="¿Qué pasó por tu cabeza?"
            value={thoughts}
            editable={isPatient}
            onChange={edit.setThoughts}
          />
          <RecordDetailField
            id="behaviours"
            icon={Footprints}
            label="Conductas"
            placeholder="¿Qué hiciste?"
            value={behaviours}
            editable={isPatient}
            onChange={edit.setBehaviours}
          />
        </div>
      </section>

      {edit.emotions.length > 1 ? (
        <RecordEmotionsSection emotions={edit.emotions} gender={gender} />
      ) : null}

      {openEditor === "emotion" ? (
        <RecordEmotionEditor
          emotion={dominantEmotion}
          quadrant={quadrant}
          gender={gender}
          onApply={(emotion) => {
            edit.updateEmotion(emotion);
            setOpenEditor(null);
          }}
          onClose={() => setOpenEditor(null)}
        />
      ) : null}

      {openEditor === "body" ? (
        <RecordBodyEditor
          sensations={getEditableSensations(edit.bodySensations)}
          onApply={(sensations) => {
            edit.updateBodySensations(sensations);
            setOpenEditor(null);
          }}
          onClose={() => setOpenEditor(null)}
        />
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
              onClick={edit.save}
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
