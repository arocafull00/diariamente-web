import { ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

import type { GrammaticalGender } from "@/db/schema";
import { getPsychologistNoun } from "@/lib/grammatical-gender";
import { formatRecordDate, getFullName } from "@/lib/utils-app";

type AccessLogItemProps = {
  viewedAt: Date;
  recordId: string;
  recordOccurredAt: Date;
  firstName: string | null;
  lastName: string | null;
  grammaticalGender: GrammaticalGender;
};

export function AccessLogItem({
  viewedAt,
  recordId,
  recordOccurredAt,
  firstName,
  lastName,
  grammaticalGender,
}: AccessLogItemProps) {
  return (
    <li>
      <Link
        href={`/registro/${recordId}`}
        data-cuelume-tap="type"
        className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/60"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
          <Eye className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">
            Tu {getPsychologistNoun(grammaticalGender)}{" "}
            {getFullName(firstName, lastName)}
          </span>
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
            Vio tu registro del {formatRecordDate(recordOccurredAt)} el{" "}
            {formatRecordDate(viewedAt)}
          </span>
        </span>
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground/60"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
