import { cn } from "@/lib/utils";
import type { InstallGuideToolbarItem as ToolbarItem } from "@/components/pwa/install-guide-content";

type InstallGuideToolbarItemProps = {
  item: ToolbarItem;
  target: boolean;
};

export function InstallGuideToolbarItem({
  item,
  target,
}: InstallGuideToolbarItemProps) {
  if (item === "address") {
    return (
      <span className="flex h-7 min-w-0 flex-1 items-center justify-center truncate rounded-full bg-background px-3 text-xs text-muted-foreground">
        Diariamente
      </span>
    );
  }

  const Icon = item;

  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center">
      {target && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
      )}
      <span
        className={cn(
          "relative flex size-8 items-center justify-center rounded-full",
          target ? "bg-primary text-primary-foreground" : "text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
    </span>
  );
}
