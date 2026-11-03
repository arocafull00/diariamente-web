const TWA_REFERRER = "android-app://com.arocafull.apppsicologia";
const TWA_KEY = "diariamente-twa";
const PLAY_REVIEW_KEY = "diariamente-play-review";
const PLAY_REVIEW_RATED = "rated";
const PLAY_REVIEW_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

export const PLAY_STORE_REVIEW_URL = "market://details?id=com.arocafull.apppsicologia";

export function isTrustedWebActivity() {
  try {
    if (document.referrer.startsWith(TWA_REFERRER)) {
      localStorage.setItem(TWA_KEY, "1");
      return true;
    }

    return localStorage.getItem(TWA_KEY) === "1";
  } catch {
    return false;
  }
}

export function isPlayReviewPending() {
  try {
    const value = localStorage.getItem(PLAY_REVIEW_KEY);

    if (!value) {
      return true;
    }

    if (value === PLAY_REVIEW_RATED) {
      return false;
    }

    return Date.now() - Number(value) > PLAY_REVIEW_SNOOZE_MS;
  } catch {
    return false;
  }
}

export function markPlayReviewRated() {
  try {
    localStorage.setItem(PLAY_REVIEW_KEY, PLAY_REVIEW_RATED);
  } catch {}
}

export function snoozePlayReview() {
  try {
    localStorage.setItem(PLAY_REVIEW_KEY, String(Date.now()));
  } catch {}
}
