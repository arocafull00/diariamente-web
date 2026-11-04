import type { GrammaticalGender } from "@/db/schema";
import { getContextTagLabel } from "@/lib/context-tags";
import type { MoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordContextGroupProps = {
  label: string;
  tags: string[];
  styles: MoodStyles;
  gender: GrammaticalGender;
};

export function RecordContextGroup({
  label,
  tags,
  styles,
  gender,
}: RecordContextGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground">{label}</h3>
      <p className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium motion-safe:animate-pop-in",
              styles.soft,
              styles.strong,
            )}
            style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
          >
            {getContextTagLabel(tag, gender)}
          </span>
        ))}
      </p>
    </div>
  );
}
