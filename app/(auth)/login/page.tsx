import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import logo from "../../../public/logo.png";

import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";
import { FaceCluster } from "@/components/faces/face-cluster";

export default async function LoginPage() {
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
        <div className="space-y-8">
          <div className="mx-auto w-full max-w-[350px] text-center">
            <h1 className="font-heading text-[2.15rem] font-black leading-[1.02] tracking-[-0.06em] text-foreground sm:text-[2.5rem]">
              Te damos la
              <br />
              bienvenida a
              <br />
              <span className="text-primary">Diariamente</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[340px] text-[0.95rem] leading-6 text-muted-foreground">
              Un espacio privado para registrar cómo te sientes y compartir tu
              evolución con tu profesional.
            </p>
          </div>
          <FaceCluster />
        </div>
        <GoogleSignInForm />
      </div>
    </div>
  );
}
