"use client";

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { FeedbackTrigger, UserRole } from "@/db/schema";
import { useMediaQuery } from "@/hooks/use-media-query";

type FeedbackSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
  trigger: FeedbackTrigger;
};

export function FeedbackSheet({
  open,
  onOpenChange,
  role,
  trigger,
}: FeedbackSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className="flex max-h-[90dvh] flex-col rounded-t-[2rem] bg-background sm:max-w-md lg:max-h-none lg:rounded-none"
      >
        {open ? (
          <FeedbackForm
            role={role}
            trigger={trigger}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
