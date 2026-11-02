import Image from "next/image";

import appIcon from "../../../app/icon.png";

import { cn } from "@/lib/utils";

import { AppHeaderBackButton } from "./app-header-back-button";

type AppHeaderProps = {
  title: string;
  centerLabel?: string;
  showBack?: boolean;
  action?: React.ReactNode;
};

export function AppHeader({ title, centerLabel, showBack, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 pt-[max(0px,env(safe-area-inset-top))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div
        className={cn(
          "mx-auto grid h-14 w-full max-w-lg grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 px-4 lg:h-20 lg:max-w-7xl lg:px-8",
          !centerLabel && "lg:flex",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-start",
            (!showBack || centerLabel) && "lg:hidden",
          )}
        >
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
        <div
          className={cn(
            "min-w-0 text-center lg:flex-1 lg:text-left",
            centerLabel && "lg:col-start-1 lg:row-start-1",
          )}
        >
          <h1 className="truncate text-base leading-tight font-semibold lg:text-xl">
            {title}
          </h1>
        </div>
        {centerLabel ? (
          <p className="hidden min-w-0 truncate text-center text-sm font-semibold tracking-wider text-muted-foreground uppercase lg:col-start-2 lg:row-start-1 lg:block">
            {centerLabel}
          </p>
        ) : null}
        <div className="flex items-center justify-end lg:col-start-3 lg:row-start-1">
          {action}
        </div>
      </div>
    </header>
  );
}
