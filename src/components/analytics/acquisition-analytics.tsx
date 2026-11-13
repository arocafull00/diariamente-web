"use client";

import { Analytics } from "@vercel/analytics/next";
import { trackAcquisition } from "@/lib/acquisition";

export function AcquisitionAnalytics() {
  return <Analytics beforeSend={trackAcquisition} />;
}
