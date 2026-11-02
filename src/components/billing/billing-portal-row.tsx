"use client";

import type { LucideIcon } from "lucide-react";

import type { IllustrationName } from "@/lib/illustrations";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { openBillingPortal } from "@/server/actions/billing";

import { useBillingRedirect } from "./use-billing-redirect";

type BillingPortalRowProps = {
  icon: LucideIcon | IllustrationName;
  title: string;
  description: string;
};

export function BillingPortalRow({ icon, title, description }: BillingPortalRowProps) {
  const { pending, redirect } = useBillingRedirect(openBillingPortal);

  return (
    <button
      type="button"
      data-cuelume-tap=""
      className={settingsRowClassName}
      disabled={pending}
      onClick={redirect}
    >
      <SettingsRowContent
        icon={icon}
        tone="primary"
        title={title}
        description={description}
        loading={pending}
      />
    </button>
  );
}
