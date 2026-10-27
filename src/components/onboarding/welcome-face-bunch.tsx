import { Face } from "@/components/faces/face";
import type { FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

const BUNCH_PLACEMENTS = [
  { className: "left-0 top-0 w-[44%] -rotate-12", delay: "0s" },
  { className: "right-0 top-[6%] w-[44%] rotate-12", delay: "-1.6s" },
  { className: "left-[4%] top-[52%] w-[44%] rotate-6", delay: "-3.1s" },
  { className: "right-0 top-[58%] w-[40%] -rotate-6", delay: "-4.4s" },
] as const;

type WelcomeFaceBunchProps = {
  faceIds: readonly FaceId[];
};

export function WelcomeFaceBunch({ faceIds }: WelcomeFaceBunchProps) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-80 sm:max-w-96"
    >
      {faceIds.slice(0, BUNCH_PLACEMENTS.length).map((faceId, index) => (
        <Face
          key={faceId}
          faceId={faceId}
          size={256}
          priority
          className={cn(
            "absolute h-auto drop-shadow-md motion-safe:animate-mood-float",
            BUNCH_PLACEMENTS[index].className,
          )}
          style={{ animationDelay: BUNCH_PLACEMENTS[index].delay }}
        />
      ))}
    </div>
  );
}
