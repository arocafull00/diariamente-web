"use client";

import type { UseFormReturn } from "react-hook-form";

import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EmailPasswordFormProps = {
  form: UseFormReturn<EmailPasswordValues>;
  onSubmit: () => void;
  submitLabel: string;
  pendingLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
};

export function EmailPasswordForm({
  form,
  onSubmit,
  submitLabel,
  pendingLabel,
  passwordAutoComplete,
}: EmailPasswordFormProps) {
  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="auth-email">Correo electrónico</Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          aria-invalid={Boolean(errors.email)}
          className="h-12 rounded-xl bg-card"
          {...form.register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="auth-password">Contraseña</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete={passwordAutoComplete}
          aria-invalid={Boolean(errors.password)}
          className="h-12 rounded-xl bg-card"
          {...form.register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl"
      >
        {isSubmitting ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
