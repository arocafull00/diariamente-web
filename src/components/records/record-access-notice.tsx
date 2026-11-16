import Link from "next/link";

import type { GrammaticalGender } from "@/db/schema";
import { getPsychologistNoun } from "@/lib/grammatical-gender";
import { ACCESS_LOG_PATH } from "@/lib/privacy";
import { formatRecordDate, getFullName } from "@/lib/utils-app";

type RecordAccessNoticeProps = {
  views: {
    viewedAt: Date;
    firstName: string | null;
    lastName: string | null;
    grammaticalGender: GrammaticalGender;
  }[];
};

export function RecordAccessNotice({ views }: RecordAccessNoticeProps) {
  const [latest] = views;

  if (!latest) {
    return (
      <p className="px-1 text-sm text-muted-foreground">
        Nadie ha abierto este registro todavía.
      </p>
    );
  }

  const otherViews = views.length - 1;

  return (
    <p className="px-1 text-sm text-muted-foreground">
      <span>
        Tu {getPsychologistNoun(latest.grammaticalGender)}{" "}
        {getFullName(latest.firstName, latest.lastName)} lo vio el{" "}
        {formatRecordDate(latest.viewedAt)}
        {otherViews > 0
          ? ` (y ${otherViews} ${otherViews === 1 ? "vez" : "veces"} más)`
          : ""}
        .{" "}
        <Link href={ACCESS_LOG_PATH} data-cuelume-tap="type" className="font-medium text-primary underline">
          Ver historial
        </Link>
      </span>
    </p>
  );
}
