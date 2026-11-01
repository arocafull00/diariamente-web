const CLINIC_INTENT_KEY = "diariamente.onboarding-clinic";

export function markClinicSignupIntent() {
  try {
    sessionStorage.setItem(CLINIC_INTENT_KEY, "1");
  } catch {}
}

export function consumeClinicSignupIntent() {
  try {
    const hasIntent = sessionStorage.getItem(CLINIC_INTENT_KEY) === "1";
    sessionStorage.removeItem(CLINIC_INTENT_KEY);
    return hasIntent;
  } catch {
    return false;
  }
}
