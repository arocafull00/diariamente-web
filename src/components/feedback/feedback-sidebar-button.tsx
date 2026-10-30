"use client";

import { MessageCircleHeart } from "lucide-react";
import { useState } from "react";

import { FEEDBACK_COPY } from "@/components/feedback/feedback-content";
import { FeedbackSheet } from "@/components/feedback/feedback-sheet";
import type { UserRole } from "@/db/schema";

type FeedbackSidebarButtonProps = {
  role: UserRole;
};

export function FeedbackSidebarButton({ role }: FeedbackSidebarButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        data-cuelume-tap=""
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setOpen(true)}
      >
        <MessageCircleHeart className="size-5" aria-hidden="true" />
        {FEEDBACK_COPY.entryTitle}
      </button>
      <FeedbackSheet
        open={open}
        onOpenChange={setOpen}
        role={role}
        trigger="sidebar"
      />
    </>
  );
}
