import type { ReactNode } from "react";

import { WizardProgress } from "@/components/wizard/wizard-progress";
import { cn } from "@/lib/utils";

type WizardShellProps = {
  step: number;
  steps: readonly string[];
  title?: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
  header?: ReactNode;
  progressAriaLabel?: string;
  centerContent?: boolean;
  titleRef?: React.RefObject<HTMLHeadingElement | null>;
  className?: string;
  error?: string;
};

export function WizardShell({
  step,
  steps,
  title,
  description,
  children,
  footer,
  header,
  progressAriaLabel,
  centerContent = false,
  titleRef,
  className,
  error,
}: WizardShellProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col lg:mx-auto lg:my-auto lg:max-w-xl! lg:flex-none!",
        className,
      )}
    >
      {header}

      <div className="pt-7 sm:pt-9">
        <WizardProgress
          step={step}
          steps={steps}
          ariaLabel={progressAriaLabel}
        />
      </div>

      <div className="flex flex-1 flex-col pt-9 sm:pt-11">
        <div
          className={cn(
            "flex flex-1 flex-col",
            centerContent ? "justify-center" : "justify-start",
          )}
        >
          {title || description ? (
            <div className="mb-7 max-w-xl">
              {title ? (
                <h1
                  ref={titleRef}
                  tabIndex={titleRef ? -1 : undefined}
                  className="text-balance text-2xl font-bold tracking-tight outline-none sm:text-3xl"
                >
                  {title}
                </h1>
              ) : null}
              {description ? (
                <p className="mt-2 max-w-lg text-pretty text-base leading-7 text-foreground/70">
                  {description}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="w-full max-w-xl">{children}</div>

          {error ? (
            <p
              role="alert"
              aria-live="polite"
              className="mt-5 max-w-xl rounded-lg bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-auto pt-10 sm:pt-12">{footer}</div>
      </div>
    </div>
  );
}
