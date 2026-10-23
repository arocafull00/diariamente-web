import { InstallGuideToolbarItem } from "@/components/pwa/install-guide-toolbar-item";
import type { InstallGuide } from "@/components/pwa/install-guide-content";
import { cn } from "@/lib/utils";

type InstallGuideToolbarProps = {
  toolbar: NonNullable<InstallGuide["toolbar"]>;
};

export function InstallGuideToolbar({ toolbar }: InstallGuideToolbarProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-28 flex-col overflow-hidden rounded-xl border border-border bg-background",
        toolbar.position === "top" ? "justify-start" : "justify-end",
      )}
    >
      <div className="flex items-center gap-2 bg-muted px-3 py-2">
        {toolbar.items.map((item, index) => (
          <InstallGuideToolbarItem
            key={index}
            item={item}
            target={index === toolbar.targetIndex}
          />
        ))}
      </div>
    </div>
  );
}
