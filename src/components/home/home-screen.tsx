"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AppLoading } from "@/components/app-shell/app-loading";
import { FeedbackPromptCard } from "@/components/feedback/feedback-prompt-card";
import { HomeCheckIn } from "@/components/home/home-check-in";
import { HomeLatestMood } from "@/components/home/home-latest-mood";
import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";
import { RecordCard } from "@/components/records/record-card";
import { useCachedScreen } from "@/hooks/use-cached-screen";
import { cn } from "@/lib/utils";
import { getHomeScreenData } from "@/server/actions/screen-data";

type HomeScreenProps = {
  refreshedAt: number;
};

export function HomeScreen({ refreshedAt }: HomeScreenProps) {
  const { data, hasHydrated } = useCachedScreen(
    "home",
    getHomeScreenData,
    refreshedAt,
  );

  if (!hasHydrated) {
    return null;
  }

  if (!data) {
    return <AppLoading />;
  }

  const [latestRecord, ...olderRecords] = data.recentRecords;

  return (
    <div>
      <div
        className={cn(
          "space-y-6 lg:grid lg:items-start lg:gap-8 lg:space-y-0",
          latestRecord
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]"
            : "lg:mx-auto lg:w-full lg:max-w-3xl",
        )}
      >
        <div className="space-y-4 lg:sticky lg:top-8">
          <HomeCheckIn
            firstName={data.firstName}
            period={data.period}
            streak={data.streak}
            week={data.week}
            todayRecords={data.todayRecords}
          />
          {data.showFeedbackPrompt ? <FeedbackPromptCard /> : null}
        </div>

        {latestRecord ? (
          <div className="space-y-6">
            <HomeLatestMood
              record={latestRecord}
              gender={data.grammaticalGender}
            />

            {olderRecords.length > 0 ? (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-4 px-1">
                  <h2 className="font-semibold">Antes</h2>
                  <Link
                    href="/mis-registros"
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    Ver todos
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
                <StaggerList className="space-y-3">
                  {olderRecords.map((record) => (
                    <StaggerItem key={record.id}>
                      <RecordCard
                        record={record}
                        href={`/registro/${record.id}`}
                        gender={data.grammaticalGender}
                      />
                    </StaggerItem>
                  ))}
                </StaggerList>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
