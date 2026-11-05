"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { BillingReturnFeedback } from "@/components/billing/billing-return-feedback";
import type { BillingSummary } from "@/components/billing/billing-status-copy";
import { ProfileSubscriptionCard } from "@/components/billing/profile-subscription-card";
import { SettingsDeleteAccountDialog } from "@/components/profile/settings-delete-account-dialog";
import { SettingsGroup } from "@/components/profile/settings-group";
import { SettingsMainView } from "@/components/profile/settings-main-view";
import { SettingsPrivacyGroup } from "@/components/profile/settings-privacy-group";
import { ProfileReferralCard } from "@/components/referrals/profile-referral-card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { GrammaticalGender, UserRole } from "@/db/schema";
import { cn } from "@/lib/utils";
import { saveReminderSettings } from "@/server/actions/reminders";

type SettingsSheetProps = {
  role: UserRole;
  remindersEnabled: boolean;
  grammaticalGender: GrammaticalGender;
  subscription?: {
    billing: BillingSummary;
    referral?: { code: string; joined: number; rewarded: number };
  };
};

const SETTINGS_SUBVIEWS = {
  privacy: {
    title: "Privacidad y cuenta",
    description: "Consulta las políticas, descarga tus datos o elimina tu cuenta.",
  },
  subscription: { title: "Suscripción", description: "Consulta y gestiona tu plan." },
};

type SettingsView = "main" | keyof typeof SETTINGS_SUBVIEWS;

const SUBVIEW_CLASS_NAME =
  "absolute inset-0 overflow-y-auto px-5 pb-6 transition-[translate,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export function SettingsSheet({
  role,
  remindersEnabled,
  grammaticalGender,
  subscription,
}: SettingsSheetProps) {
  const router = useRouter();
  const [{ open, view }, setSheet] = useState<{ open: boolean; view: SettingsView }>(
    () => {
      const billingReturn =
        subscription && typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("suscripcion")
          : null;
      const open = billingReturn === "ok" || billingReturn === "gestionar";

      return { open, view: open ? "subscription" : "main" };
    },
  );
  const [, startSaveTransition] = useTransition();
  const [enabled, setEnabled] = useState(remindersEnabled);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subview = view === "main" ? null : SETTINGS_SUBVIEWS[view];

  useEffect(() => {
    if (open) {
      titleRef.current?.focus();
    }
  }, [open, view]);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setEnabled(remindersEnabled);
    }

    setSheet({ open: nextOpen, view: nextOpen ? "main" : view });
  }

  function showView(view: SettingsView) {
    setSheet({ open, view });
  }

  function handleEnabledChange(checked: boolean) {
    setEnabled(checked);

    startSaveTransition(async () => {
      const result = await saveReminderSettings({ enabled: checked });

      if (result.error) {
        toast.error(result.error);
        setEnabled(remindersEnabled);
        return;
      }

      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95"
        aria-label="Ajustes"
      >
        <Settings className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        initialFocus={titleRef}
        className="flex flex-col gap-0 overflow-hidden bg-background sm:max-w-md"
      >
        <SheetHeader className="px-5 pt-6 pb-4">
          <div className="flex min-h-10 items-center gap-2 pr-8">
            {subview ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 bg-mood-lu-soft text-mood-lu-strong"
                aria-label="Volver a ajustes"
                onClick={() => showView("main")}
                data-cuelume-tap="type"
              >
                <ArrowLeft className="size-5" aria-hidden="true" />
              </Button>
            ) : null}
            <SheetTitle
              ref={titleRef}
              tabIndex={-1}
              className="text-2xl font-bold tracking-tight outline-none"
            >
              {subview?.title ?? "Ajustes"}
            </SheetTitle>
          </div>
          <SheetDescription>
            {subview?.description ??
              (role === "patient"
                ? "Ponlo todo a tu gusto: recordatorios, avisos y tu cuenta."
                : "Ponlo todo a tu gusto.")}
          </SheetDescription>
        </SheetHeader>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            inert={view !== "main"}
            aria-hidden={view !== "main"}
            className={cn(
              SUBVIEW_CLASS_NAME,
              "flex flex-col gap-6",
              view !== "main"
                ? "pointer-events-none -translate-x-full opacity-0"
                : "translate-x-0 opacity-100",
            )}
          >
            <SettingsMainView
              role={role}
              grammaticalGender={grammaticalGender}
              enabled={enabled}
              onEnabledChange={handleEnabledChange}
              onPrivacy={() => showView("privacy")}
              onSubscription={subscription ? () => showView("subscription") : undefined}
            />
          </div>
          <div
            inert={view !== "privacy"}
            aria-hidden={view !== "privacy"}
            className={cn(
              SUBVIEW_CLASS_NAME,
              "grid content-start gap-6",
              view === "privacy"
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-full opacity-0",
            )}
          >
            <SettingsPrivacyGroup role={role} />
            <SettingsGroup title="Zona de peligro">
              <SettingsDeleteAccountDialog />
            </SettingsGroup>
          </div>
          {subscription ? (
            <div
              inert={view !== "subscription"}
              aria-hidden={view !== "subscription"}
              className={cn(
                SUBVIEW_CLASS_NAME,
                "grid content-start gap-6",
                view === "subscription"
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-full opacity-0",
              )}
            >
              {view === "subscription" ? <BillingReturnFeedback /> : null}
              <ProfileSubscriptionCard billing={subscription.billing} />
              {subscription.referral ? <ProfileReferralCard {...subscription.referral} /> : null}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
