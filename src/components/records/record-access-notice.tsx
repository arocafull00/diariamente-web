import { Eye, EyeOff } from "lucide-react";
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
      <p className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
        <EyeOff className="size-4 shrink-0" aria-hidden="true" />
        Ningún profesional ha abierto este registro.
      </p>
    );
  }

  const otherViews = views.length - 1;

  return (
    <p className="flex items-start gap-2 px-1 text-sm text-muted-foreground">
      <Eye className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <span>
        Tu {getPsychologistNoun(latest.grammaticalGender)}{" "}
        {getFullName(latest.firstName, latest.lastName)} lo vio el{" "}
        {formatRecordDate(latest.viewedAt)}
        {otherViews > 0
          ? ` (y ${otherViews} ${otherViews === 1 ? "vez" : "veces"} más)`
          : ""}
        .{" "}
        <Link href={ACCESS_LOG_PATH} className="font-medium text-primary underline">
          Ver historial
        </Link>
      </span>
    </p>
  );
}
