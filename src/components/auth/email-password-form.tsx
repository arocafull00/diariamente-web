"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EmailPasswordFormProps = {
  form: UseFormReturn<EmailPasswordValues>;
  onSubmit: () => void;
  submitLabel: string;
  pendingLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
  beforeSubmit?: ReactNode;
};

export function EmailPasswordForm({
  form,
  onSubmit,
  submitLabel,
  pendingLabel,
  passwordAutoComplete,
  beforeSubmit,
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
        <PasswordInput
          id="auth-password"
          autoComplete={passwordAutoComplete}
          aria-invalid={Boolean(errors.password)}
          className="h-12 rounded-xl bg-card"
          {...form.register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      {beforeSubmit}
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
