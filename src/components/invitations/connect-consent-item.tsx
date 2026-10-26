import type { LucideIcon } from "lucide-react";

type ConnectConsentItemProps = {
  icon: LucideIcon;
  text: string;
};

export function ConnectConsentItem({ icon: Icon, text }: ConnectConsentItemProps) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <span>{text}</span>
    </li>
  );
}
