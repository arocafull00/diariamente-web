import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";

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
      <StaggerList className="space-y-4 lg:grid lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:space-y-0">
        <StaggerItem className="lg:sticky lg:top-24 lg:self-start">{header}</StaggerItem>
        <StaggerItem className={cardsClassName}>{children}</StaggerItem>
      </StaggerList>
    </div>
  );
}
