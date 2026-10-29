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
      className="size-10 text-primary"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-5" aria-hidden="true" />
    </Button>
  );
}
