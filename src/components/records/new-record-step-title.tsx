import { cn } from "@/lib/utils";

type NewRecordStepTitleProps = {
  eyebrow?: string;
  before: string;
  emphasis?: string;
  after?: string;
  emphasisClassName?: string;
  className?: string;
};

export function NewRecordStepTitle({
  eyebrow,
  before,
  emphasis,
  after = "",
  emphasisClassName,
  className,
}: NewRecordStepTitleProps) {
  return (
    <div className={cn("space-y-2 pt-4", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both motion-safe:duration-350 motion-safe:ease-out-quart motion-safe:[animation-delay:40ms]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl leading-tight font-medium text-balance motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-350 motion-safe:ease-out-quart motion-safe:[animation-delay:80ms] sm:text-4xl">
        {before}
        {emphasis ? (
          <>
            {" "}
            <span className={cn("italic", emphasisClassName)}>
              {emphasis.toLowerCase()}
            </span>
          </>
        ) : null}
        {after}
      </h2>
    </div>
  );
}
