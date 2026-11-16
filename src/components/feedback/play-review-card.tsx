"use client";

import { PLAY_REVIEW_COPY } from "@/components/feedback/feedback-content";
import { usePlayReviewPrompt } from "@/components/feedback/use-play-review-prompt";
import { Button } from "@/components/ui/button";

export function PlayReviewCard() {
  const { visible, rate, dismiss } = usePlayReviewPrompt();

  if (!visible) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-[2rem] bg-mood-hp-soft/60 p-5 ring-1 ring-border/50 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out-quart">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-mood-hp-strong uppercase">
          {PLAY_REVIEW_COPY.eyebrow}
        </p>
        <p className="text-lg font-bold text-balance">{PLAY_REVIEW_COPY.title}</p>
        <p className="text-sm text-muted-foreground">
          {PLAY_REVIEW_COPY.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="rounded-full" onClick={rate}>
          {PLAY_REVIEW_COPY.rate}
        </Button>
        <Button variant="ghost" className="rounded-full" onClick={dismiss}>
          {PLAY_REVIEW_COPY.dismiss}
        </Button>
      </div>
    </section>
  );
}
