import Link from "next/link";

type AppHeaderProps = {
  title: string;
  backHref?: string;
};

export function AppHeader({ title, backHref }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
        {backHref ? (
          <Link
            href={backHref}
            className="text-sm font-medium text-primary"
          >
            Volver
          </Link>
        ) : (
          <div className="w-12" />
        )}
        <h1 className="flex-1 truncate text-center text-base font-semibold">
          {title}
        </h1>
        <div className="w-12" />
      </div>
    </header>
  );
}
