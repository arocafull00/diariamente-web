"use client";

import { AppHeader } from "@/components/app-shell/app-header";
import { AppLoading } from "@/components/app-shell/app-loading";
import { NewRecordHeaderButton } from "@/components/app-shell/new-record-header-button";
import { MyRecordsEmptyState } from "@/components/records/my-records-empty-state";
import { RecordMoodOverview } from "@/components/records/record-mood-overview";
import { RecordTimeline } from "@/components/records/record-timeline";
import { useCachedScreen } from "@/hooks/use-cached-screen";
import { getMyRecordsScreenData } from "@/server/actions/screen-data";

type MyRecordsScreenProps = {
  refreshedAt: number;
};

export function MyRecordsScreen({ refreshedAt }: MyRecordsScreenProps) {
  const { data, hasHydrated } = useCachedScreen(
    "records",
    getMyRecordsScreenData,
    refreshedAt,
  );

  if (!hasHydrated) {
    return <AppHeader title="Mis registros" action={<NewRecordHeaderButton />} />;
  }

  return (
    <>
      <AppHeader title="Mis registros" action={<NewRecordHeaderButton />} />
      {!data ? (
        <AppLoading />
      ) : (
        <div className="space-y-6">
          {data.records.length === 0 ? (
            <MyRecordsEmptyState />
          ) : (
            <>
              <RecordMoodOverview
                title="Tu balance emocional"
                records={data.records}
              />
              <RecordTimeline
                records={data.records}
                gender={data.grammaticalGender}
                showUnseen={false}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
