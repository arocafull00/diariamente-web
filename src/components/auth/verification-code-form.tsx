"use client";

import type { UseFormReturn } from "react-hook-form";

import type { VerificationCodeValues } from "@/components/auth/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerificationCodeFormProps = {
  form: UseFormReturn<VerificationCodeValues>;
  email: string;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
};

export function VerificationCodeForm({
  form,
  email,
  onSubmit,
  onResend,
  onBack,
}: VerificationCodeFormProps) {
  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full space-y-4">
      <p className="text-center text-sm leading-6 text-muted-foreground">
        Te hemos enviado un código de 6 dígitos a{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>
      <div className="space-y-2">
        <Label htmlFor="auth-code">Código de verificación</Label>
        <Input
          id="auth-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          aria-invalid={Boolean(errors.code)}
          className="h-12 rounded-xl bg-card text-center text-lg tracking-[0.4em]"
          {...form.register("code")}
        />
        {errors.code ? (
          <p className="text-sm text-destructive">{errors.code.message}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl"
      >
        {isSubmitting ? "Comprobando..." : "Continuar"}
      </Button>
      <div className="flex items-center justify-between">
        <Button type="button" variant="link" size="sm" onClick={onBack}>
          Cambiar correo
        </Button>
        <Button type="button" variant="link" size="sm" onClick={onResend}>
          Reenviar código
        </Button>
      </div>
    </form>
  );
}
