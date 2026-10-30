"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import {
  FEEDBACK_COPY,
  FEEDBACK_KIND_OPTIONS,
} from "@/components/feedback/feedback-content";
import { GrammaticalGenderOption } from "@/components/profile/grammatical-gender-option";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { FeedbackTrigger, UserRole } from "@/db/schema";
import { getFeedbackClientContext } from "@/lib/feedback";
import { submitFeedback } from "@/server/actions/feedback";
import { feedbackFormSchema } from "@/validation/schemas";

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

type FeedbackFormProps = {
  role: UserRole;
  trigger: FeedbackTrigger;
  onDone: () => void;
};

export function FeedbackForm({ role, trigger, onDone }: FeedbackFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: { kind: "idea", message: "", wantsCall: false },
  });
  const { errors } = form.formState;

  function handleSubmit(values: FeedbackFormValues) {
    startTransition(async () => {
      const result = await submitFeedback({
        ...values,
        trigger,
        clientContext: getFeedbackClientContext(),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(FEEDBACK_COPY.success);
      onDone();
    });
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <SheetHeader>
        <SheetTitle className="text-2xl font-bold tracking-tight">
          {FEEDBACK_COPY.sheetTitle}
        </SheetTitle>
        <SheetDescription>{FEEDBACK_COPY.sheetDescription}</SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-2">
        <Controller
          control={form.control}
          name="kind"
          render={({ field }) => (
            <fieldset className="flex flex-wrap gap-2" disabled={pending}>
              <legend className="sr-only">Tipo de comentario</legend>
              {FEEDBACK_KIND_OPTIONS.map((option) => (
                <GrammaticalGenderOption
                  key={option.value}
                  name={field.name}
                  value={option.value}
                  label={option.label}
                  selected={field.value === option.value}
                  onSelect={() => field.onChange(option.value)}
                />
              ))}
            </fieldset>
          )}
        />
        <div className="space-y-1.5">
          <Textarea
            {...form.register("message")}
            placeholder={FEEDBACK_COPY.messagePlaceholder}
            rows={6}
            disabled={pending}
            aria-label="Tu comentario"
            aria-invalid={Boolean(errors.message)}
            className="min-h-36 resize-none"
          />
          {errors.message ? (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          ) : null}
        </div>
        {role === "psychologist" ? (
          <Controller
            control={form.control}
            name="wantsCall"
            render={({ field }) => (
              <label
                htmlFor="feedback-wants-call"
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {FEEDBACK_COPY.callLabel}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {FEEDBACK_COPY.callDescription}
                  </span>
                </span>
                <Switch
                  id="feedback-wants-call"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={pending}
                />
              </label>
            )}
          />
        ) : null}
      </div>
      <SheetFooter className="flex-row justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          className="w-28"
          disabled={pending}
          onClick={onDone}
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-28" disabled={pending}>
          {pending ? (
            <LoaderCircle
              className="animate-spin"
              data-icon="inline-start"
              aria-hidden="true"
            />
          ) : (
            <Send data-icon="inline-start" aria-hidden="true" />
          )}
          {pending ? "Enviando..." : "Enviar"}
        </Button>
      </SheetFooter>
    </form>
  );
}
