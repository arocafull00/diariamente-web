"use client";

import type { SealedLiveQuery } from "@neon/realtime/client";

import {
  renewPatientRecordsSignal,
  renewLinkedPatientsSignal,
} from "@/server/actions/realtime";

import { useLiveSignal } from "./use-live-signal";

type PsychologistLiveSignalsProps = {
  patients: SealedLiveQuery<{ id: string }>;
  records: SealedLiveQuery<{ id: string }>;
};

export function PsychologistLiveSignals({
  patients,
  records,
}: PsychologistLiveSignalsProps) {
  useLiveSignal(patients, renewLinkedPatientsSignal);
  useLiveSignal(records, renewPatientRecordsSignal);

  return null;
}
