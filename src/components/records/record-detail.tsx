"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { AppHeader } from "@/components/app-shell/app-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PatientRecord } from "@/db/schema";
import type { Profile } from "@/db/schema";
import { getEmotionColor } from "@/lib/emotions";
import { formatIntensity, INTENSITY_BADGE_COLORS } from "@/lib/intensity";
import { formatRecordDate } from "@/lib/utils-app";
import {
  markRecordAsSeen,
  updatePatientRecord,
} from "@/server/actions/records";

type RecordDetailProps = {
  profile: Profile;
  record: PatientRecord;
};

export function RecordDetail({ profile, record }: RecordDetailProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [situation, setSituation] = useState(record.situation);
  const [thoughts, setThoughts] = useState(record.thoughts);
  const [behaviours, setBehaviours] = useState(record.behaviours);
  const isPatient = profile.role === "patient";
  const isPsychologist = profile.role === "psychologist";
  const intensityColors = INTENSITY_BADGE_COLORS[record.emotionIntensity];

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
    <>
      <AppHeader
        title="Detalle del registro"
        backHref={isPatient ? "/mis-registros" : "/pacientes"}
      />
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {formatRecordDate(record.occurredAt)}
        </p>
        <span
          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: intensityColors.bg,
            color: intensityColors.text,
          }}
        >
          Intensidad {formatIntensity(record.emotionIntensity)}
        </span>

        <div className="space-y-2">
          <Label htmlFor="situation">Situación</Label>
          <Textarea
            id="situation"
            rows={4}
            value={situation}
            readOnly={!isPatient}
            onChange={(e) => setSituation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thoughts">Pensamientos</Label>
          <Textarea
            id="thoughts"
            rows={4}
            value={thoughts}
            readOnly={!isPatient}
            onChange={(e) => setThoughts(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="behaviours">Conductas</Label>
          <Textarea
            id="behaviours"
            rows={4}
            value={behaviours}
            readOnly={!isPatient}
            onChange={(e) => setBehaviours(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Emociones</Label>
          {record.emotions.map((emotion) => {
            const colors = getEmotionColor(emotion.emotion);

            return (
              <div
                key={emotion.emotion}
                className="rounded-lg p-3"
                style={{ backgroundColor: colors.bg }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    {emotion.emotion}
                  </span>
                  <span className="text-sm" style={{ color: colors.text }}>
                    {emotion.intensity}/10
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {isPatient ? (
          <Button className="w-full" disabled={pending} onClick={handleSave}>
            {pending ? "Guardando..." : "Guardar cambios"}
          </Button>
        ) : null}
      </div>
    </>
  );
}
