import { Check } from "lucide-react";

import type { MoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type PatientRecordEmotionOptionProps = {
  label: string;
  count: number;
  styles: MoodStyles;
  selected: boolean;
  onToggle: () => void;
};

export function PatientRecordEmotionOption({
  label,
  count,
  styles,
  selected,
  onToggle,
}: PatientRecordEmotionOptionProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          selected ? cn(styles.soft, styles.strong) : "hover:bg-secondary",
        )}
      >
        <span
          className={cn("size-3 shrink-0 rounded-full", styles.tones[3])}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {count}
        </span>
        <Check
          className={cn("size-4 shrink-0", selected ? "opacity-100" : "opacity-0")}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}
