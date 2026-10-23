import type { WelcomeFeature } from "@/components/onboarding/welcome-content";

type WelcomeFeatureItemProps = {
  feature: WelcomeFeature;
};

export function WelcomeFeatureItem({ feature }: WelcomeFeatureItemProps) {
  const { icon: Icon, title, description } = feature;

  return (
    <li className="flex items-start gap-4 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm leading-5 text-foreground/65">
          {description}
        </p>
      </div>
    </li>
  );
}
