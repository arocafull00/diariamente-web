import type { MoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordContextGroupProps = {
  label: string;
  tags: string[];
  styles: MoodStyles;
};

export function RecordContextGroup({ label, tags, styles }: RecordContextGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground">{label}</h3>
      <p className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn("rounded-full px-3 py-1 text-sm font-medium", styles.soft, styles.strong)}
          >
            {tag}
          </span>
        ))}
      </p>
    </div>
  );
}
