"use server";

import { requireUser } from "@/server/auth/get-current-profile";
import {
  sealPatientRecordsSignal,
  sealPendingRequestsSignal,
} from "@/server/realtime/psychologist-signals";

export async function renewPendingRequestsSignal() {
  return sealPendingRequestsSignal(await requireUser());
}

export async function renewPatientRecordsSignal() {
  return sealPatientRecordsSignal(await requireUser());
}
