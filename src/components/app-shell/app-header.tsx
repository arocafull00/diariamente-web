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
      <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-3 px-4 lg:h-20 lg:max-w-7xl lg:px-8">
        {showBack ? <AppHeaderBackButton /> : <div className="w-12 lg:hidden" />}
        <div className="flex-1 truncate lg:text-left">
          {eyebrow ? (
            <p className="hidden text-xs font-medium tracking-wider text-primary uppercase lg:block">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate text-center text-base font-semibold lg:text-left lg:text-xl">
            {title}
          </h1>
        </div>
        {action ?? <div className="w-12 lg:hidden" />}
      </div>
    </header>
  );
}
