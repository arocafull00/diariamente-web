import { auth } from "@clerk/nextjs/server";
import { BarChart3, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import logo from "../../../../public/logo.png";

import { ClinicSignupIntent } from "@/components/auth/clinic-signup-intent";
import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";
import { ClinicLoginFeature } from "@/components/clinics/clinic-login-feature";

export const metadata: Metadata = {
  title: "Acceso para clínicas",
};

const FEATURES = [
  { icon: Users, text: "Gestiona el equipo de psicólogos de tu centro." },
  { icon: BarChart3, text: "Consulta pacientes y actividad de forma agregada." },
  {
    icon: ShieldCheck,
    text: "Los registros y notas clínicas siguen siendo privados.",
  },
] as const;

export default async function ClinicLoginPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center px-6 py-10">
      <ClinicSignupIntent />
      <header className="flex items-center justify-center gap-2.5 py-1">
        <Image
          src={logo}
          alt=""
          width={32}
          height={32}
          priority
          className="size-8 rounded-lg"
        />
        <span className="text-lg font-bold tracking-tight text-primary">
          Diariamente
        </span>
      </header>
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-8">
        <div className="mx-auto w-full max-w-[350px] text-center">
          <h1 className="font-heading text-[2.15rem] font-black leading-[1.02] tracking-[-0.06em] text-foreground sm:text-[2.5rem]">
            Diariamente
            <br />
            <span className="text-primary">para clínicas</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[340px] text-[0.95rem] leading-6 text-muted-foreground">
            Un panel para coordinar a tu equipo sin acceder nunca a la
            información clínica de los pacientes.
          </p>
        </div>
        <ul className="w-full space-y-3">
          {FEATURES.map((feature) => (
            <ClinicLoginFeature
              key={feature.text}
              icon={feature.icon}
              text={feature.text}
            />
          ))}
        </ul>
        <div className="w-full space-y-4">
          <GoogleSignInForm />
          <p className="text-center text-sm text-muted-foreground">
            ¿Eres paciente o psicólogo/a?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Accede aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
