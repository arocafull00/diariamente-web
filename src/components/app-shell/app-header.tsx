import Image from "next/image";

import appIcon from "../../../app/icon.png";

import { cn } from "@/lib/utils";

import { AppHeaderBackButton } from "./app-header-back-button";

type AppHeaderProps = {
  title: string;
  eyebrow?: string;
  showBack?: boolean;
  action?: React.ReactNode;
};

export function AppHeader({ title, eyebrow, showBack, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 pt-[max(0px,env(safe-area-inset-top))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-14 w-full max-w-lg grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 px-4 lg:flex lg:h-20 lg:max-w-7xl lg:px-8">
        <div className={cn("flex items-center justify-start", !showBack && "lg:hidden")}>
          {showBack ? (
            <AppHeaderBackButton />
          ) : (
            <Image
              src={appIcon}
              alt="Diariamente"
              width={32}
              height={32}
              className="size-8 rounded-lg lg:hidden"
              priority
            />
          )}
        </div>
        <div className="min-w-0 text-center lg:flex-1 lg:text-left">
          {eyebrow ? (
            <p className="hidden text-xs font-semibold tracking-wider text-primary uppercase lg:block">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate text-base leading-tight font-semibold lg:text-xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center justify-end">{action}</div>
      </div>
    </header>
  );
}
