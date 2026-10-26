import type { LucideIcon } from "lucide-react";

import { ConnectConsentItem } from "./connect-consent-item";

type ConnectConsentListProps = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

export function ConnectConsentList({ title, icon, items }: ConnectConsentListProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <ConnectConsentItem key={item} icon={icon} text={item} />
        ))}
      </ul>
    </div>
  );
}
