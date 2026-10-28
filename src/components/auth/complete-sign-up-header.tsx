import Image from "next/image";

import { FaceCluster } from "@/components/faces/face-cluster";

export function CompleteSignUpHeader() {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center gap-2.5">
        <Image
          src="/logo.png"
          alt=""
          width={40}
          height={40}
          className="size-10 object-contain"
          preload
        />
        <span className="text-lg font-bold tracking-tight text-primary">
          Diariamente
        </span>
      </div>
      <FaceCluster className="mt-7 max-w-48 sm:max-w-56" />
      <h1 className="mt-5 text-balance font-heading text-3xl font-black leading-tight tracking-tight sm:text-4xl">
        Tu espacio empieza aquí
      </h1>
      <p className="mt-3 max-w-xs text-pretty text-base leading-6 text-muted-foreground">
        Revisa tus datos y completa el registro. Nos alegra tenerte por aquí.
      </p>
    </header>
  );
}
