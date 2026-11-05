"use client";

import type { SealedLiveQuery } from "@neon/realtime/client";
import { useLiveQuery } from "@neon/realtime-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type SignalRow = { id: string };

export function useLiveSignal(
  query: SealedLiveQuery<SignalRow>,
  refreshQuery: () => Promise<SealedLiveQuery<SignalRow>>,
) {
  const router = useRouter();
  const { data, status } = useLiveQuery(query, { refreshQuery });
  const previousFingerprint = useRef<string | null>(null);
  const fingerprint =
    status === "live" && data
      ? data
          .map((row) => row.id)
          .sort()
          .join(",")
      : null;

  useEffect(() => {
    if (fingerprint === null) {
      return;
    }

    if (
      previousFingerprint.current !== null &&
      previousFingerprint.current !== fingerprint
    ) {
      router.refresh();
    }

    previousFingerprint.current = fingerprint;
  }, [fingerprint, router]);
}
