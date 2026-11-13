"use server";

import { requireUser } from "@/server/auth/get-current-profile";
import {
  sealPatientRecordsSignal,
  sealLinkedPatientsSignal,
} from "@/server/realtime/psychologist-signals";

export async function renewLinkedPatientsSignal() {
  return sealLinkedPatientsSignal(await requireUser());
}

export async function renewPatientRecordsSignal() {
  return sealPatientRecordsSignal(await requireUser());
}
