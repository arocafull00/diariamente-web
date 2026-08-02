import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { AppHeader } from "@/components/app-shell/app-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireRole } from "@/server/auth/get-current-profile";
import {
  getLatestPatientRecord,
  getPatientRecordCount,
  getPatientPsychologist,
} from "@/server/queries";
import { formatRecordDate, getFullName } from "@/lib/utils-app";

export default async function PatientHomePage() {
  const profile = await requireRole("patient");
  const [recordCount, latestRecord, psychologist] = await Promise.all([
    getPatientRecordCount(profile.id),
    getLatestPatientRecord(profile.id),
    getPatientPsychologist(profile.id),
  ]);

  return (
    <>
      <AppHeader title="Inicio" />
      <div className="space-y-4">
        <Card className="border-none bg-secondary">
          <CardHeader>
            <CardTitle>Hola, {profile.firstName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Llevas {recordCount} {recordCount === 1 ? "registro" : "registros"}.
            </p>
            <Link href="/nuevo-registro" className={cn(buttonVariants(), "w-full")}>
              <PlusCircle className="size-4" />
              Nuevo registro
            </Link>
          </CardContent>
        </Card>

        {latestRecord ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Último registro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="line-clamp-2 text-sm">{latestRecord.situation}</p>
              <p className="text-xs text-muted-foreground">
                {formatRecordDate(latestRecord.occurredAt)}
              </p>
              <Link
                href={`/registro/${latestRecord.id}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Ver detalle
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {psychologist ? (
          <Card>
            <CardContent className="p-4 text-sm">
              <p className="font-medium">Tu psicólogo</p>
              <p className="text-muted-foreground">
                {getFullName(psychologist.firstName, psychologist.lastName)}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  );
}
