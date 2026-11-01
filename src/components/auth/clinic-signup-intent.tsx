"use client";

import { useEffect } from "react";

import { markClinicSignupIntent } from "@/lib/onboarding-intent";

export function ClinicSignupIntent() {
  useEffect(() => {
    markClinicSignupIntent();
  }, []);

  return null;
}
