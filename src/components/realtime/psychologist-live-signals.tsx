"use client";

import type { SealedLiveQuery } from "@neon/realtime/client";

import {
  renewPatientRecordsSignal,
  renewPendingRequestsSignal,
} from "@/server/actions/realtime";

import { useLiveSignal } from "./use-live-signal";

type PsychologistLiveSignalsProps = {
  requests: SealedLiveQuery<{ id: string }>;
  records: SealedLiveQuery<{ id: string }>;
};

export function PsychologistLiveSignals({
  requests,
  records,
}: PsychologistLiveSignalsProps) {
  useLiveSignal(requests, renewPendingRequestsSignal);
  useLiveSignal(records, renewPatientRecordsSignal);

  return null;
}
