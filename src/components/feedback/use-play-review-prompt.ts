import { useState, useSyncExternalStore } from "react";

import {
  isPlayReviewPending,
  isTrustedWebActivity,
  markPlayReviewRated,
  PLAY_STORE_REVIEW_URL,
  snoozePlayReview,
} from "@/lib/play-review";

function subscribe() {
  return () => {};
}

export function usePlayReviewPrompt() {
  const eligible = useSyncExternalStore(
    subscribe,
    () => isTrustedWebActivity() && isPlayReviewPending(),
    () => false,
  );
  const [hidden, setHidden] = useState(false);

  function rate() {
    markPlayReviewRated();
    setHidden(true);
    window.location.assign(PLAY_STORE_REVIEW_URL);
  }

  function dismiss() {
    snoozePlayReview();
    setHidden(true);
  }

  return { visible: eligible && !hidden, rate, dismiss };
}
