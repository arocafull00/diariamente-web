import type { GrammaticalGender } from "@/db/schema";
import { getContextTagLabel } from "@/lib/context-tags";

type PatientSessionContextItemProps = {
  tag: string;
  count: number;
  gender: GrammaticalGender;
};

export function PatientSessionContextItem({
  tag,
  count,
  gender,
}: PatientSessionContextItemProps) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
      {getContextTagLabel(tag, gender)}
      <span className="font-semibold text-muted-foreground tabular-nums">
        ×{count}
      </span>
    </li>
  );
}
