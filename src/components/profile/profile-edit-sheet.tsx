"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Pencil, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProfileEditAvatarField } from "@/components/profile/profile-edit-avatar-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { UserRole } from "@/db/schema";
import { updateProfile } from "@/server/actions/profile";

const profileEditFormSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios"),
  remindersEnabled: z.boolean(),
});

type ProfileEditFormValues = z.infer<typeof profileEditFormSchema>;

type ProfileEditSheetProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  role: UserRole;
  reminderSettings: {
    enabled: boolean;
    frequency: "daily" | "weekly";
    time: string;
    days: string[];
  } | null;
};

export function ProfileEditSheet({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  role,
  reminderSettings,
}: ProfileEditSheetProps) {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      remindersEnabled: reminderSettings?.enabled ?? false,
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      form.reset({
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        remindersEnabled: reminderSettings?.enabled ?? false,
      });
      setSelectedFile(null);
    }

    setOpen(nextOpen);
  }

  function handleSubmit(values: ProfileEditFormValues) {
    if (!isLoaded || !user) {
      toast.error("Tu sesión aún no está lista");
      return;
    }

    startTransition(async () => {
      let nextAvatarUrl = avatarUrl ?? imageUrl ?? null;

      if (selectedFile) {
        try {
          await user.setProfileImage({ file: selectedFile });
          await user.reload();
          nextAvatarUrl = user.imageUrl;
        } catch {
          toast.error("No se pudo actualizar la foto de perfil");
          return;
        }
      }

      const result = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        avatarUrl: nextAvatarUrl,
        remindersEnabled:
          role === "patient" ? values.remindersEnabled : undefined,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Perfil actualizado");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        aria-label="Editar perfil"
      >
        <Pencil className="size-3.5" />
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>
            {role === "patient"
              ? "Actualiza tu foto, nombre y preferencias de recordatorios."
              : "Actualiza tu foto y nombre."}
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <ProfileEditAvatarField
            firstName={form.watch("firstName")}
            lastName={form.watch("lastName")}
            avatarUrl={avatarUrl}
            imageUrl={imageUrl}
            onFileChange={setSelectedFile}
            onError={(message) => toast.error(message)}
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-first-name">Nombre</Label>
              <Input
                id="profile-first-name"
                autoComplete="given-name"
                aria-invalid={Boolean(form.formState.errors.firstName)}
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-last-name">Apellidos</Label>
              <Input
                id="profile-last-name"
                autoComplete="family-name"
                aria-invalid={Boolean(form.formState.errors.lastName)}
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              ) : null}
            </div>
            {role === "patient" ? (
              <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
                <div className="space-y-1">
                  <Label htmlFor="profile-reminders">Recordatorios</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe avisos para registrar tu día.
                  </p>
                </div>
                <Controller
                  control={form.control}
                  name="remindersEnabled"
                  render={({ field }) => (
                    <Switch
                      id="profile-reminders"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            ) : null}
          </div>
          <SheetFooter className="px-0 pb-4">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
              ) : (
                <Save data-icon="inline-start" aria-hidden="true" />
              )}
              {pending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
