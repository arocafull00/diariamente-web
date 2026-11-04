import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PatientRecordsPageLinkProps = {
  href: string | null;
  direction: "newer" | "older";
};

export function PatientRecordsPageLink({
  href,
  direction,
}: PatientRecordsPageLinkProps) {
  const className = cn(buttonVariants({ variant: "outline" }), "min-w-0");
  const content =
    direction === "newer" ? (
      <>
        <ChevronLeft data-icon="inline-start" aria-hidden="true" />
        Más recientes
      </>
    ) : (
      <>
        Más antiguos
        <ChevronRight data-icon="inline-end" aria-hidden="true" />
      </>
    );

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(className, "pointer-events-none opacity-40")}
      >
        {content}
      </span>
    );
  }

  return (
    <Link href={`${href}#registros`} className={className}>
      {content}
    </Link>
  );
}
