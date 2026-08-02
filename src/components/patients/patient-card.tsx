import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getFullName } from "@/lib/utils-app";
import { cn } from "@/lib/utils";

type PatientCardProps = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  unseenCount: number;
};

export function PatientCard({
  id,
  firstName,
  lastName,
  avatarUrl,
  unseenCount,
}: PatientCardProps) {
  const hasUnseenRecords = unseenCount > 0;

  return (
    <Link
      href={`/pacientes/${id}`}
      className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative w-full overflow-hidden rounded-2xl border border-secondary bg-card p-4 shadow-sm transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md group-active:translate-y-0 motion-reduce:transform-none">
        <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />

        <div className="flex items-center gap-3">
          <Avatar className="size-11 rounded-xl after:rounded-xl">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt=""
                className="rounded-xl"
              />
            ) : null}
            <AvatarFallback className="rounded-xl bg-secondary text-sm font-semibold text-primary ring-1 ring-secondary">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {getFullName(firstName, lastName)}
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  hasUnseenRecords
                    ? "bg-intensity-low-accent"
                    : "bg-muted-foreground/40",
                )}
                aria-hidden="true"
              />
              <span className="text-xs text-muted-foreground">
                {hasUnseenRecords ? "Registro disponible" : "Al día"}
              </span>
            </div>
          </div>

          {hasUnseenRecords ? (
            <div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground shadow-sm">
              {unseenCount > 99 ? "99+" : unseenCount}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
