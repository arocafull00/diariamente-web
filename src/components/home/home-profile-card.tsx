import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFullName, getInitials } from "@/lib/utils-app";

type HomeProfileCardProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

export function HomeProfileCard({
  firstName,
  lastName,
  avatarUrl,
}: HomeProfileCardProps) {
  return (
    <section className="hidden rounded-2xl border border-border bg-card p-5 lg:block">
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="shrink-0">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback className="font-semibold text-primary">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {getFullName(firstName, lastName)}
          </p>
          <p className="text-sm text-muted-foreground">Tu perfil</p>
        </div>
      </div>
      <Link
        href="/perfil"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/80"
      >
        Gestionar perfil
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
