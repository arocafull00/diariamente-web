"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmotionChip } from "@/components/records/emotion-chip";
import { RecordDatePicker } from "@/components/records/record-date-picker";
import { RecordTimeInput } from "@/components/records/record-time-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { WizardFooter } from "@/components/wizard/wizard-footer";
import { WizardShell } from "@/components/wizard/wizard-shell";
import type { RecordEmotion } from "@/db/schema";
import { PREDEFINED_EMOTIONS } from "@/lib/emotions";
import { createPatientRecord, createCustomEmotion } from "@/server/actions/records";
import { useNewRecordStore } from "@/stores/new-record-store";

type NewRecordWizardProps = {
  customEmotions: string[];
};

const STEPS = [
  "¿Cuándo ocurrió?",
  "¿Qué ha pasado?",
  "¿Qué pensamientos tuviste?",
  "¿Cómo reaccionaste?",
  "¿Qué emociones sentiste?",
] as const;

export function NewRecordWizard({ customEmotions }: NewRecordWizardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addingEmotion, startAddEmotion] = useTransition();
  const [newEmotion, setNewEmotion] = useState("");
  const [optimisticCustomEmotions, setOptimisticCustomEmotions] = useState<string[]>([]);
  const {
    step,
    occurredAt,
    situation,
    thoughts,
    behaviours,
    emotions,
    setField,
    nextStep,
    previousStep,
    reset,
  } = useNewRecordStore();

  const allEmotions = Array.from(
    new Set([...PREDEFINED_EMOTIONS, ...customEmotions, ...optimisticCustomEmotions]),
  );
  const isLastStep = step === STEPS.length - 1;

  function toggleEmotion(emotion: string) {
    const existing = emotions.find((item) => item.emotion === emotion);

    if (existing) {
      setField(
        "emotions",
        emotions.filter((item) => item.emotion !== emotion),
      );
      return;
    }

    setField("emotions", [...emotions, { emotion, intensity: 5 }]);
  }

  function updateEmotionIntensity(emotion: string, intensity: number) {
    setField(
      "emotions",
      emotions.map((item) =>
        item.emotion === emotion ? { ...item, intensity } : item,
      ),
    );
  }

  function canContinue() {
    if (step === 1) {
      return situation.trim().length > 0;
    }

    if (step === 2) {
      return thoughts.trim().length > 0;
    }

    if (step === 3) {
      return behaviours.trim().length > 0;
    }

    if (step === 4) {
      return emotions.length > 0;
    }

    return true;
  }

  function handlePrimaryAction() {
    if (isLastStep) {
      handleSubmit();
      return;
    }

    nextStep();
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createPatientRecord({
        occurredAt,
        situation,
        thoughts,
        behaviours,
        emotions,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      reset();
      toast.success("Registro creado");
      router.push(result.recordId ? `/registro/${result.recordId}` : "/mis-registros");
    });
  }

  function handleAddCustomEmotion() {
    const trimmed = newEmotion.trim();

    if (!trimmed) {
      return;
    }

    if (allEmotions.includes(trimmed)) {
      toast.error("Esta emoción ya existe");
      return;
    }

    setOptimisticCustomEmotions((current) => [...current, trimmed]);
    setNewEmotion("");
    toggleEmotion(trimmed);

    startAddEmotion(async () => {
      const result = await createCustomEmotion(trimmed);

      if (result.error) {
        setOptimisticCustomEmotions((current) =>
          current.filter((emotion) => emotion !== trimmed),
        );
        setField(
          "emotions",
          useNewRecordStore
            .getState()
            .emotions.filter((item) => item.emotion !== trimmed),
        );
        toast.error(result.error);
        return;
      }

      toast.success("Emoción añadida");
    });
  }

  return (
    <WizardShell
      className="flex-1"
        step={step}
        steps={STEPS}
        centerContent={step < 4}
        progressAriaLabel="Progreso del registro"
        footer={
          <WizardFooter
            showBack={step > 0}
            onBack={previousStep}
            primaryLabel={
              isLastStep ? (pending ? "Guardando..." : "Guardar registro") : "Continuar"
            }
            primaryDisabled={!canContinue()}
            primaryPending={isLastStep && pending}
            onPrimaryClick={handlePrimaryAction}
            primaryIcon={isLastStep ? "save" : "continue"}
          />
        }
      >
        {step === 0 ? (
          <div className="space-y-4">
            <RecordDatePicker
              value={occurredAt}
              onChange={(date) => setField("occurredAt", date)}
            />
            <RecordTimeInput
              value={occurredAt}
              onChange={(date) => setField("occurredAt", date)}
            />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-2">
            <Label htmlFor="situation">Situación</Label>
            <Textarea
              id="situation"
              rows={6}
              value={situation}
              onChange={(e) => setField("situation", e.target.value)}
              placeholder="Describe qué ha pasado..."
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-2">
            <Label htmlFor="thoughts">Pensamientos</Label>
            <Textarea
              id="thoughts"
              rows={6}
              value={thoughts}
              onChange={(e) => setField("thoughts", e.target.value)}
              placeholder="¿Qué pensaste en ese momento?"
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-2">
            <Label htmlFor="behaviours">Conductas</Label>
            <Textarea
              id="behaviours"
              rows={6}
              value={behaviours}
              onChange={(e) => setField("behaviours", e.target.value)}
              placeholder="¿Cómo reaccionaste?"
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {allEmotions.map((emotion) => {
                const selected = emotions.some((item) => item.emotion === emotion);

                return (
                  <EmotionChip
                    key={emotion}
                    emotion={emotion}
                    selected={selected}
                    onClick={() => toggleEmotion(emotion)}
                  />
                );
              })}
            </div>
            <div className="flex items-stretch gap-2">
              <Input
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value)}
                placeholder="Nueva emoción"
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0 px-4"
                disabled={addingEmotion}
                onClick={handleAddCustomEmotion}
              >
                <Plus data-icon="inline-start" aria-hidden="true" />
                {addingEmotion ? "Añadiendo..." : "Añadir"}
              </Button>
            </div>
            <div className="space-y-4">
              {emotions.map((item: RecordEmotion) => (
                <div key={item.emotion} className="space-y-2 rounded-lg bg-secondary p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.emotion}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.intensity}/10
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[item.intensity]}
                    onValueChange={(value) => {
                      const intensity = Array.isArray(value) ? value[0] : value;
                      updateEmotionIntensity(item.emotion, intensity ?? 5);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </WizardShell>
  );
}
