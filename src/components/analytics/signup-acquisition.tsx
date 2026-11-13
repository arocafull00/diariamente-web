"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { getAcquisitionPlatform } from "@/lib/acquisition";
import { SIGNUP_ACQUISITION_WINDOW } from "@/lib/signup-acquisition";
import { saveSignupAttribution } from "@/server/actions/signup-acquisition";

export function SignupAcquisition() {
  const { user } = useUser();
  const userId = user?.id;
  const createdAt = user?.createdAt?.getTime();
  useEffect(() => { getAcquisitionPlatform(); }, []);
  useEffect(() => {
    if (!userId || !createdAt || Date.now() - createdAt > SIGNUP_ACQUISITION_WINDOW) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const platform = getAcquisitionPlatform();
    async function save(attempt: number) {
      const result = await saveSignupAttribution(platform).catch(() => null);
      if (!cancelled && !result?.success && attempt < 2) timer = setTimeout(() => void save(attempt + 1), 3000);
    }
    void save(0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [userId, createdAt]);
  return null;
}
