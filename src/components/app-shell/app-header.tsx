import { AppHeaderBackButton } from "./app-header-back-button";

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
};

export function AppHeader({ title, showBack, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 pt-[max(0px,env(safe-area-inset-top))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-3 px-4">
        {showBack ? <AppHeaderBackButton /> : <div className="w-12" />}
        <h1 className="flex-1 truncate text-center text-base font-semibold">
          {title}
        </h1>
        {action ?? <div className="w-12" />}
      </div>
    </header>
  );
}
