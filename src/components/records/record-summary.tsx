import { CalendarDays } from "lucide-react";

import { RecordIntensityMeter } from "@/components/records/record-intensity-meter";
import type { EmotionIntensity } from "@/db/schema";
import { formatIntensity, INTENSITY_STYLES } from "@/lib/intensity";
import { cn } from "@/lib/utils";
import { formatRecordDate } from "@/lib/utils-app";

type RecordSummaryProps = {
  occurredAt: Date;
  intensity: EmotionIntensity;
};

export function RecordSummary({ occurredAt, intensity }: RecordSummaryProps) {
  const styles = INTENSITY_STYLES[intensity];

  return (
    <section className={cn("rounded-xl p-5 shadow-sm", styles.panel)}>
      <div className={cn("flex items-center gap-2 text-sm", styles.text)}>
        <CalendarDays className="size-4" aria-hidden="true" />
        <time dateTime={occurredAt.toISOString()}>
          {formatRecordDate(occurredAt)}
        </time>
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className={cn("text-xs font-semibold", styles.text)}>
            Intensidad emocional
          </p>
          <p className={cn("mt-1 text-2xl font-bold", styles.text)}>
            {formatIntensity(intensity)}
          </p>
        </div>
        <div className="w-28 pb-1 sm:w-36">
          <RecordIntensityMeter intensity={intensity} />
        </div>
      </div>
    </section>
  );
}
