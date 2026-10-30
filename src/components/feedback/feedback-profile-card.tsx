"use client";

import { MessageCircleHeart } from "lucide-react";
import { useState } from "react";

import { FEEDBACK_COPY } from "@/components/feedback/feedback-content";
import { FeedbackSheet } from "@/components/feedback/feedback-sheet";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import type { UserRole } from "@/db/schema";

type FeedbackProfileCardProps = {
  role: UserRole;
};

export function FeedbackProfileCard({ role }: FeedbackProfileCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
        <button
          type="button"
          data-cuelume-tap=""
          className={settingsRowClassName}
          onClick={() => setOpen(true)}
        >
          <SettingsRowContent
            icon={MessageCircleHeart}
            tone="yellow"
            title={FEEDBACK_COPY.entryTitle}
            description={FEEDBACK_COPY.entryDescription}
          />
        </button>
      </div>
      <FeedbackSheet
        open={open}
        onOpenChange={setOpen}
        role={role}
        trigger="profile"
      />
    </>
  );
}
