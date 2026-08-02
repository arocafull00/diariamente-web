type ProfileLayoutProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  cardsLayout?: "stack" | "grid";
};

export function ProfileLayout({
  header,
  children,
  cardsLayout = "stack",
}: ProfileLayoutProps) {
  const cardsClassName =
    cardsLayout === "grid"
      ? "grid gap-4 sm:grid-cols-1 xl:grid-cols-2"
      : "grid max-w-xl gap-4";

  return (
    <div className="w-full">
      <div className="space-y-4 lg:grid lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:space-y-0">
        <div className="lg:sticky lg:top-24 lg:self-start">{header}</div>
        <div className={cardsClassName}>{children}</div>
      </div>
    </div>
  );
}
