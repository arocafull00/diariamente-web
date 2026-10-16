import { cn } from "@/lib/utils";

type SensationPadLabelProps = {
  label: string;
  active: boolean;
  activeClassName: string;
  orientation?: "horizontal" | "vertical-up" | "vertical-down";
};

export function SensationPadLabel({
  label,
  active,
  activeClassName,
  orientation = "horizontal",
}: SensationPadLabelProps) {
  return (
    <span
      className={cn(
        "text-xs font-semibold whitespace-nowrap transition-colors duration-200",
        orientation !== "horizontal" && "[writing-mode:vertical-rl]",
        orientation === "vertical-up" && "rotate-180",
        active ? activeClassName : "text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}
