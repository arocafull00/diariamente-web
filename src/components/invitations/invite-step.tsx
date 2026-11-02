import { Illustration } from "@/components/faces/illustration";
import type { IllustrationName } from "@/lib/illustrations";

type InviteStepProps = {
  icon: IllustrationName;
  title: string;
  description: string;
};

export function InviteStep({
  icon,
  title,
  description,
}: InviteStepProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <Illustration name={icon} className="size-10" />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </li>
  );
}
