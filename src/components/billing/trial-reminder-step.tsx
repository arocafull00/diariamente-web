import { Illustration } from "@/components/faces/illustration";

type TrialReminderStepProps = {
  reminderDate: string;
};

export function TrialReminderStep({ reminderDate }: TrialReminderStepProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="font-display text-[1.75rem] leading-tight font-medium text-balance sm:text-[2.1rem]">
        Te avisamos <span className="text-mood-lp-strong italic">2 días antes</span> de que acabe tu
        prueba
      </h1>
      <p className="text-sm font-semibold text-foreground/70">
        Te llega un aviso el {reminderDate}
      </p>
      <Illustration name="reloj" className="size-40 motion-safe:animate-mood-float" />
    </div>
  );
}
