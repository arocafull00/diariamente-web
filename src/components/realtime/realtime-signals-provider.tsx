"use client";

import { drizzleParsers } from "@neon/realtime-drizzle/client";
import { createRealtimeClient, type RealtimeClient } from "@neon/realtime/client";
import { RealtimeProvider } from "@neon/realtime-react";
import { useState } from "react";

let browserClient: RealtimeClient | null = null;

function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_NEON_REALTIME_URL;

  if (typeof window === "undefined" || !url) {
    return null;
  }

  browserClient ??= createRealtimeClient({ url, parsers: drizzleParsers });

  return browserClient;
}

type RealtimeSignalsProviderProps = {
  children: React.ReactNode;
};

export function RealtimeSignalsProvider({ children }: RealtimeSignalsProviderProps) {
  const [client] = useState(getBrowserClient);

  if (!client) {
    return null;
  }

  return <RealtimeProvider client={client}>{children}</RealtimeProvider>;
}
