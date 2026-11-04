"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AppHeaderBackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Volver"
      data-cuelume-tap="type"
      className="group size-10 text-primary"
      onClick={() => router.back()}
    >
      <ArrowLeft
        className="size-5 transition-[translate] duration-200 ease-spring group-hover:-translate-x-0.5 group-active:-translate-x-1"
        aria-hidden="true"
      />
    </Button>
  );
}
