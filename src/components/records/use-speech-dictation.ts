"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

type SpeechRecognitionErrorEvent = Event & { error: string };

type SpeechRecognitionResultEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionInstance = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const SILENT_ERRORS = new Set(["aborted", "no-speech"]);

function getSpeechRecognition() {
  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function subscribeToNothing() {
  return () => {};
}

function joinText(base: string, addition: string) {
  if (!addition) return base;
  if (!base || /\s$/.test(base)) return base + addition;
  return `${base} ${addition}`;
}

export function useSpeechDictation(
  value: string,
  onChange: (value: string) => void,
  maxLength: number,
) {
  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    () => getSpeechRecognition() !== null,
    () => false,
  );
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  function start() {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const baseText = value;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript.trim())
        .filter(Boolean)
        .join(" ");

      onChange(joinText(baseText, transcript).slice(0, maxLength));
    };

    recognition.onerror = (event) => {
      if (SILENT_ERRORS.has(event.error)) return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        toast.error("Permite el acceso al micrófono para dictar");
        return;
      }
      toast.error("No se ha podido usar el dictado por voz");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function toggle() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    start();
  }

  return { isSupported, isListening, toggle };
}
