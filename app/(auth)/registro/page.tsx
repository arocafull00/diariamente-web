import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import logo from "../../../public/logo.png";

import { AuthDivider } from "@/components/auth/auth-divider";
import { EmailSignUpForm } from "@/components/auth/email-sign-up-form";
import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";

export default async function RegisterPage() {
  const { isAuthenticated } = await auth();

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
            ¡Empecemos!
          </h1>
          <p className="mx-auto mt-4 max-w-[340px] text-[0.95rem] leading-6 text-muted-foreground">
            Crea tu cuenta y empieza a registrar cómo te sientes en tu propio rincón privado.
          </p>
        </div>
        <div className="w-full space-y-4">
          <EmailSignUpForm />
          <AuthDivider />
          <GoogleSignInForm />
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
