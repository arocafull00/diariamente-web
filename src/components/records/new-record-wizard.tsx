"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { AppHeader } from "@/components/app-shell/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
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
];

export function NewRecordWizard({ customEmotions }: NewRecordWizardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [newEmotion, setNewEmotion] = useState("");
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

  const allEmotions = [...PREDEFINED_EMOTIONS, ...customEmotions];
  const progress = ((step + 1) / STEPS.length) * 100;

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

  async function handleAddCustomEmotion() {
    if (!newEmotion.trim()) {
      return;
    }

    const result = await createCustomEmotion(newEmotion.trim());

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setNewEmotion("");
    toast.success("Emoción añadida");
    router.refresh();
  }

  return (
    <>
      <AppHeader title="Nuevo registro" backHref="/inicio" />
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{STEPS[step]}</span>
            <span className="text-muted-foreground">
              {step + 1}/{STEPS.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {step === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={occurredAt.toISOString().slice(0, 10)}
                onChange={(e) => {
                  const next = new Date(occurredAt);
                  const [year, month, day] = e.target.value.split("-").map(Number);
                  next.setFullYear(year, month - 1, day);
                  setField("occurredAt", next);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={occurredAt.toTimeString().slice(0, 5)}
                onChange={(e) => {
                  const next = new Date(occurredAt);
                  const [hours, minutes] = e.target.value.split(":").map(Number);
                  next.setHours(hours, minutes, 0, 0);
                  setField("occurredAt", next);
                }}
              />
            </div>
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
            <div className="flex flex-wrap gap-2">
              {allEmotions.map((emotion) => {
                const selected = emotions.some((item) => item.emotion === emotion);

                return (
                  <Button
                    key={emotion}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    onClick={() => toggleEmotion(emotion)}
                  >
                    {emotion}
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value)}
                placeholder="Nueva emoción"
              />
              <Button type="button" variant="outline" onClick={handleAddCustomEmotion}>
                Añadir
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

        <div className="flex gap-2">
          {step > 0 ? (
            <Button variant="outline" className="flex-1" onClick={previousStep}>
              Atrás
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          {step < STEPS.length - 1 ? (
            <Button
              className="flex-1"
              disabled={!canContinue()}
              onClick={nextStep}
            >
              Continuar
            </Button>
          ) : (
            <Button
              className="flex-1"
              disabled={!canContinue() || pending}
              onClick={handleSubmit}
            >
              {pending ? "Guardando..." : "Guardar registro"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
