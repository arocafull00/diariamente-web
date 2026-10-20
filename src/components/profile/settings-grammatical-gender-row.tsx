"use client";

import { MessageCircleHeart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { GrammaticalGenderField } from "@/components/profile/grammatical-gender-field";
import type { GrammaticalGender } from "@/db/schema";
import { GRAMMATICAL_GENDER_QUESTION } from "@/lib/grammatical-gender";
import { updateGrammaticalGender } from "@/server/actions/profile";

type SettingsGrammaticalGenderRowProps = {
  grammaticalGender: GrammaticalGender;
};

export function SettingsGrammaticalGenderRow({
  grammaticalGender,
}: SettingsGrammaticalGenderRowProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(grammaticalGender);

  function handleChange(next: GrammaticalGender) {
    setValue(next);

    startTransition(async () => {
      const result = await updateGrammaticalGender({ grammaticalGender: next });

      if (result.error) {
        toast.error(result.error);
        setValue(grammaticalGender);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div data-slot="settings-row" className="flex w-full gap-3 px-4 py-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
        <MessageCircleHeart className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 pt-2">
        <GrammaticalGenderField
          name="grammaticalGender"
          legend={GRAMMATICAL_GENDER_QUESTION}
          legendClassName="text-[0.95rem] font-semibold"
          value={value}
          onChange={handleChange}
          disabled={pending}
        />
      </div>
    </div>
  );
}
