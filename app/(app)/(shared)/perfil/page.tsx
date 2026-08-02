import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { LinkPsychologistForm } from "@/components/invitations/link-psychologist-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getPatientPsychologist } from "@/server/queries";
import { getFullName, getInitials } from "@/lib/utils-app";
import { unlinkFromPsychologistAction } from "@/server/actions/invitations";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const user = await currentUser();
  const psychologist =
    profile.role === "patient"
      ? await getPatientPsychologist(profile.id)
      : null;

  return (
    <>
      <AppHeader title="Perfil" />
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="size-16">
              {user?.imageUrl ? (
                <AvatarImage src={user.imageUrl} alt="" />
              ) : null}
              <AvatarFallback>
                {getInitials(profile.firstName, profile.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {getFullName(profile.firstName, profile.lastName)}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-sm capitalize text-muted-foreground">
                {profile.role === "patient" ? "Paciente" : "Psicólogo"}
              </p>
            </div>
          </CardContent>
        </Card>

        {profile.role === "patient" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mi psicólogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {psychologist ? (
                <>
                  <p className="text-sm">
                    {getFullName(psychologist.firstName, psychologist.lastName)}
                  </p>
                  <form action={unlinkFromPsychologistAction}>
                    <Button type="submit" variant="outline" className="w-full">
                      Desvincular psicólogo
                    </Button>
                  </form>
                </>
              ) : (
                <LinkPsychologistForm />
              )}
            </CardContent>
          </Card>
        ) : null}

        <Link href="/ajustes" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Ajustes
        </Link>
      </div>
    </>
  );
}
