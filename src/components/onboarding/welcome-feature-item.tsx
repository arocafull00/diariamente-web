import { Face } from "@/components/faces/face";
import type { WelcomeFeature } from "@/components/onboarding/welcome-content";

type WelcomeFeatureItemProps = {
  feature: WelcomeFeature;
  index: number;
};

export function WelcomeFeatureItem({ feature, index }: WelcomeFeatureItemProps) {
  const { faceId, title, description } = feature;

  return (
    <li className="flex items-center gap-4 py-3.5">
      <Face
        faceId={faceId}
        size={96}
        className={
          index % 2
            ? "size-12 shrink-0 rotate-6 drop-shadow-sm"
            : "size-12 shrink-0 -rotate-6 drop-shadow-sm"
        }
      />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm leading-5 text-foreground/65">
          {description}
        </p>
      </div>
    </li>
  );
}
