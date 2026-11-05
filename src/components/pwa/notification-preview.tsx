import Image from "next/image";

import logo from "../../../public/logo.png";

type NotificationPreviewProps = {
  title: string;
  body: string;
};

export function NotificationPreview({ title, body }: NotificationPreviewProps) {
  return (
    <div
      aria-hidden="true"
      className="flex w-full items-start gap-3 rounded-3xl bg-card px-4 py-3.5 text-left shadow-md ring-1 ring-border/50 motion-safe:animate-mood-float"
    >
      <Image
        src={logo}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-xl object-contain"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-semibold text-foreground/65">Diariamente</p>
          <p className="text-xs text-foreground/50">ahora</p>
        </div>
        <p className="mt-0.5 font-semibold">{title}</p>
        <p className="text-sm leading-5 text-foreground/70">{body}</p>
      </div>
    </div>
  );
}
