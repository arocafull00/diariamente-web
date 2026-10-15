import { HomeWeekDay } from "@/components/home/home-week-day";
import type { MoodQuadrant } from "@/db/schema";
import type { WeekDay } from "@/lib/dates";

type HomeWeekStripProps = {
  days: (WeekDay & { quadrant: MoodQuadrant | null; hasRecord: boolean })[];
};

export function HomeWeekStrip({ days }: HomeWeekStripProps) {
  return (
    <ol className="grid grid-cols-7 gap-1" aria-label="Tu semana">
      {days.map((day) => (
        <HomeWeekDay
          key={day.key}
          label={day.label}
          isToday={day.isToday}
          isFuture={day.isFuture}
          quadrant={day.quadrant}
          hasRecord={day.hasRecord}
        />
      ))}
    </ol>
  );
}
