"use client";

import { BodySensationsBodyView } from "@/components/records/body-sensations-body-view";
import type { useBodySensationsSheet } from "@/components/records/use-body-sensations-sheet";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { BodySensation } from "@/db/schema";

type BodySensationsSheetProps = {
  sheet: ReturnType<typeof useBodySensationsSheet>;
  sensations: BodySensation[];
};

export function BodySensationsSheet({ sheet, sensations }: BodySensationsSheetProps) {
  return (
    <Sheet
      open={sheet.open}
      onOpenChange={(next) => {
        if (!next) {
          sheet.closeSheet();
        }
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-dvh max-h-dvh gap-0 rounded-none border-0 bg-background p-0 data-[side=bottom]:h-dvh data-[side=bottom]:border-t-0"
      >
        <BodySensationsBodyView sensations={sensations} sheet={sheet} />
      </SheetContent>
    </Sheet>
  );
}
