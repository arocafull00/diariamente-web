import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFullName, getInitials } from "@/lib/utils-app";
import { cn } from "@/lib/utils";

const toneClassNames = {
  blue: "bg-mood-lu-soft text-mood-lu-strong",
  green: "bg-mood-lp-soft text-mood-lp-strong",
} as const;

type ConnectPsychologistRowProps = {
  psychologist: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
  label: string;
  tone: keyof typeof toneClassNames;
};

export function ConnectPsychologistRow({
  psychologist,
  label,
  tone,
}: ConnectPsychologistRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 text-left">
      <Avatar className="size-10 rounded-2xl">
        {psychologist.avatarUrl ? (
          <AvatarImage src={psychologist.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback
          className={cn("rounded-2xl font-semibold", toneClassNames[tone])}
        >
          {getInitials(psychologist.firstName, psychologist.lastName)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.95rem] font-semibold">
          {getFullName(psychologist.firstName, psychologist.lastName)}
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
          toneClassNames[tone],
        )}
      >
        {label}
      </span>
    </div>
  );
}
