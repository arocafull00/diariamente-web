import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewRecordHeaderButton() {
  return (
    <Link
      href="/nuevo-registro"
      data-cuelume-tap=""
      className={cn(buttonVariants(), "group hidden lg:inline-flex")}
    >
      <Plus
        data-icon="inline-start"
        aria-hidden="true"
        className="transition-[rotate] duration-300 ease-spring group-hover:rotate-90"
      />
      Nuevo registro
    </Link>
  );
}
