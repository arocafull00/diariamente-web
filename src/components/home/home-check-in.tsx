import { Face } from "@/components/faces/face";
import { HomeMoodRing } from "@/components/home/home-mood-ring";
import { HomeStreakBadge } from "@/components/home/home-streak-badge";
import { HomeWeekStrip } from "@/components/home/home-week-strip";
import type { MoodQuadrant } from "@/db/schema";
import type { WeekDay } from "@/lib/dates";

type HomeCheckInProps = {
  firstName: string | null;
  period: string;
  streak: number;
  week: (WeekDay & { quadrant: MoodQuadrant | null; hasRecord: boolean })[];
  todayRecords: { id: string; quadrant: MoodQuadrant | null }[];
};

export function HomeCheckIn({
  firstName,
  period,
  streak,
  week,
  todayRecords,
}: HomeCheckInProps) {
  return (
    <section className="space-y-8 rounded-[2rem] bg-card/80 px-4 py-6 shadow-sm ring-1 ring-border/50 backdrop-blur sm:px-6 lg:px-10 lg:py-10">
      <HomeWeekStrip days={week} />
      <div className="space-y-2 text-center">
        <Face
          faceId="01_gradiente"
          size={64}
          priority
          className="mx-auto mb-3 size-12 rotate-6 drop-shadow-sm motion-safe:animate-mood-float"
        />
        {firstName ? (
          <p className="text-sm font-medium text-muted-foreground">
            Hola, {firstName}
          </p>
        ) : null}
        <h2 className="font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
          ¿Cómo te sientes esta {period}?
        </h2>
      </div>
      <HomeMoodRing todayRecords={todayRecords} />
      <div className="flex justify-center">
        <HomeStreakBadge streak={streak} />
      </div>
    </section>
  );
}
