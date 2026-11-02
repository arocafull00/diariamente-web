import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Illustration } from "@/components/faces/illustration";
import type { IllustrationName } from "@/lib/illustrations";

import { ProfileSectionCard } from "./profile-section-card";

type ProfileStatCardProps = {
  href: string;
  title: string;
  label: string;
  value: number;
  illustration: IllustrationName;
};

export function ProfileStatCard({
  href,
  title,
  label,
  value,
  illustration,
}: ProfileStatCardProps) {
  return (
    <ProfileSectionCard title={title}>
      <Link
        href={href}
        data-cuelume-tap="type"
        className="group -m-4 flex flex-1 items-center gap-4 rounded-3xl p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted lg:-m-5 lg:p-5"
      >
        <Illustration name={illustration} />
        <span className="min-w-0 flex-1">
          <span className="block text-3xl leading-none font-bold tracking-tight">
            {value}
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {label}
          </span>
        </span>
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </ProfileSectionCard>
  );
}
