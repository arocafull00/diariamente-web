import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewRecordHeaderButton() {
  return (
    <Link
      href="/nuevo-registro"
      className={cn(buttonVariants(), "hidden lg:inline-flex")}
    >
      <Plus data-icon="inline-start" aria-hidden="true" />
      Nuevo registro
    </Link>
  );
}
