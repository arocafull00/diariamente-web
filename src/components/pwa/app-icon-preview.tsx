import Image from "next/image";

import logo from "../../../public/logo.png";

export function AppIconPreview() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-2">
      <span className="flex size-24 items-center justify-center rounded-[1.75rem] bg-card shadow-md ring-1 ring-border/50 motion-safe:animate-mood-float">
        <Image src={logo} alt="" width={72} height={72} className="size-16 object-contain" />
      </span>
      <span className="text-sm font-semibold">Diariamente</span>
    </div>
  );
}
