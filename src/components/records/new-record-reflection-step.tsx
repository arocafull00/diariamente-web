"use client";

import { DictationButton } from "@/components/records/dictation-button";
import { DictationOverlay } from "@/components/records/dictation-overlay";
import { NewRecordNextButton } from "@/components/records/new-record-next-button";
import { NewRecordStepTitle } from "@/components/records/new-record-step-title";
import { MoodBubble } from "@/components/records/mood-bubble";
import { useSpeechDictation } from "@/components/records/use-speech-dictation";
import type { MoodQuadrant } from "@/db/schema";

const MAX_LENGTH = 5000;

type NewRecordReflectionStepProps = {
  id: string;
  eyebrow: string;
  title: string;
  placeholder: string;
  quadrant: MoodQuadrant | null;
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
};

export function NewRecordReflectionStep({
  id,
  eyebrow,
  title,
  placeholder,
  quadrant,
  value,
  onChange,
  onContinue,
}: NewRecordReflectionStepProps) {
  const isEmpty = value.trim().length === 0;
  const dictation = useSpeechDictation(value, onChange, MAX_LENGTH);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-col overflow-hidden px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <MoodBubble
        quadrant={quadrant}
        tone={1}
        className="pointer-events-none absolute -right-24 -bottom-24 size-80 opacity-50 blur-2xl"
      />
      <NewRecordStepTitle eyebrow={eyebrow} before={title} className="relative" />
      <label htmlFor={id} className="sr-only">
        {title}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={MAX_LENGTH}
        className="relative mt-6 w-full flex-1 resize-none bg-transparent font-display text-2xl leading-snug outline-none placeholder:text-muted-foreground/60"
      />
      {dictation.isListening ? <DictationOverlay quadrant={quadrant} /> : null}
      <div className="relative flex items-center justify-between gap-4 pt-4">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {dictation.isListening
            ? "Escuchando..."
            : isEmpty
              ? ""
              : `${value.length} caracteres`}
        </p>
        <div className="flex items-center gap-3">
          {dictation.isSupported ? (
            <DictationButton isListening={dictation.isListening} onClick={dictation.toggle} />
          ) : null}
          {isEmpty && !dictation.isListening ? (
            <button
              type="button"
              data-cuelume-tap=""
              onClick={onContinue}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Omitir
            </button>
          ) : null}
          <NewRecordNextButton onClick={onContinue} disabled={isEmpty} />
        </div>
      </div>
    </div>
  );
}
