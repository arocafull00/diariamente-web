import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import logo from "../../../public/logo.png";

import { FaceCluster } from "@/components/faces/face-cluster";

export default async function WelcomePage() {
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
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-10 lg:mt-auto lg:flex-none">
        <FaceCluster className="lg:hidden" />
        <h1 className="text-center font-heading text-[2rem] font-black leading-[1.08] tracking-[-0.05em] text-foreground sm:text-[2.35rem]">
          Entiende cómo te sientes,
          <br />
          <span className="text-mood-lp-strong">día a día</span>
        </h1>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3 pt-8 lg:mb-auto">
        <Link
          href="/registro"
          className="btn-raised-joy flex h-14 w-full items-center justify-center rounded-2xl text-base font-extrabold tracking-wide text-mood-foreground uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          Empieza ahora
        </Link>
        <Link
          href="/login"
          className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-b-4 border-border bg-card text-base font-extrabold tracking-wide text-primary uppercase outline-none transition-colors hover:bg-muted focus-visible:ring-4 focus-visible:ring-ring/50 active:translate-y-px active:border-b-2"
        >
          Ya tengo una cuenta
        </Link>
      </div>
    </div>
  );
}
