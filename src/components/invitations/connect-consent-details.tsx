import { ChevronDown, type LucideIcon } from "lucide-react";

import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { cn } from "@/lib/utils";

import { ConnectConsentItem } from "./connect-consent-item";

type ConnectConsentDetailsProps = {
  icon: LucideIcon;
  tone: "green" | "blue" | "yellow";
  title: string;
  description: string;
  items: string[];
};

export function ConnectConsentDetails({
  icon,
  tone,
  title,
  description,
  items,
}: ConnectConsentDetailsProps) {
  return (
    <details className="group/details">
      <summary
        className={cn(
          settingsRowClassName,
          "cursor-pointer list-none [&::-webkit-details-marker]:hidden",
        )}
      >
        <SettingsRowContent
          icon={icon}
          tone={tone}
          title={title}
          description={description}
          trailing={
            <ChevronDown
              className="size-5 shrink-0 text-muted-foreground/60 transition-transform duration-200 ease-spring group-open/details:rotate-180"
              aria-hidden="true"
            />
          }
        />
      </summary>
      <ul className="space-y-2 px-4 pb-4 pl-[4.25rem] text-left text-sm text-muted-foreground">
        {items.map((item) => (
          <ConnectConsentItem key={item} icon={icon} text={item} />
        ))}
      </ul>
    </details>
  );
}
