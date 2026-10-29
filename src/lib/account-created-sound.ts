import { playCompletionSound } from "@/lib/completion-sound";

const ACCOUNT_CREATED_KEY = "diariamente.account-created";

export function markAccountCreated() {
  sessionStorage.setItem(ACCOUNT_CREATED_KEY, "1");
}

export function clearAccountCreated() {
  sessionStorage.removeItem(ACCOUNT_CREATED_KEY);
}

export function playAccountCreatedSound() {
  if (!sessionStorage.getItem(ACCOUNT_CREATED_KEY)) {
    return;
  }

  clearAccountCreated();
  playCompletionSound();
}
