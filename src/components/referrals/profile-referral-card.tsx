import { Gift } from "lucide-react";

import { ProfileSectionCard } from "@/components/profile/profile-section-card";

import { ReferralShareButtons } from "./referral-share-buttons";

type ProfileReferralCardProps = {
  code: string;
  joined: number;
  rewarded: number;
};

function getStatsLabel(joined: number, rewarded: number) {
  const joinedLabel = joined === 1 ? "1 colega se ha unido" : `${joined} colegas se han unido`;
  const rewardedLabel = rewarded === 1 ? "1 mes ganado" : `${rewarded} meses ganados`;

  return `${joinedLabel} · ${rewardedLabel}`;
}

export function ProfileReferralCard({ code, joined, rewarded }: ProfileReferralCardProps) {
  return (
    <ProfileSectionCard title="Invita a un colega">
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mood-hp-soft text-mood-hp-strong">
          <Gift className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Un mes gratis para los dos</p>
          <p className="text-sm text-muted-foreground">
            Tu colega estrena un mes extra de prueba y tú te llevas un mes gratis cuando se suscriba.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-mood-lp-soft px-4 py-3">
        <span className="text-xs font-semibold tracking-wider text-mood-lp-strong uppercase">
          Tu código
        </span>
        <span className="font-display text-2xl font-medium tracking-[0.2em] text-mood-lp-strong tabular-nums">
          {code}
        </span>
      </div>
      <div className="mt-3">
        <ReferralShareButtons code={code} />
      </div>
      {joined > 0 ? (
        <p className="mt-3 px-1 text-sm text-muted-foreground">{getStatsLabel(joined, rewarded)}</p>
      ) : null}
    </ProfileSectionCard>
  );
}
