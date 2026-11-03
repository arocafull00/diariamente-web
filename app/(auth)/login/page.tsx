import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import logo from "../../../public/logo.png";

import { AuthDivider } from "@/components/auth/auth-divider";
import { EmailSignInForm } from "@/components/auth/email-sign-in-form";
import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const [{ isAuthenticated }, { email }] = await Promise.all([auth(), searchParams]);

  if (isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center px-6 py-10">
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
            ¡Hola de nuevo!
          </h1>
        </div>
        <div className="w-full space-y-4">
          <EmailSignInForm defaultEmail={email} />
          <AuthDivider />
          <GoogleSignInForm />
          <div className="flex flex-col items-center gap-2 text-sm">
            <Link
              href="/recuperar-password"
              className="text-muted-foreground underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                href="/onboarding"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
