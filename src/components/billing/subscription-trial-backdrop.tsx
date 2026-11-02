import { Face } from "@/components/faces/face";
import type { FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

const BACKDROP_FACES: { faceId: FaceId; className: string; delay: string }[] = [
  { faceId: "alegria", className: "-left-10 top-6 w-32 -rotate-12 sm:w-44", delay: "0s" },
  { faceId: "02_azul_rosa", className: "-right-8 top-24 w-24 rotate-12 sm:w-36", delay: "-2.3s" },
  { faceId: "04_naranja_amarillo", className: "-left-6 top-[48%] w-20 rotate-6 sm:w-28", delay: "-4.1s" },
  { faceId: "05_rosa_verde", className: "-right-10 bottom-36 w-28 -rotate-6 sm:w-40", delay: "-1.4s" },
  { faceId: "03_verde_morado", className: "-left-8 bottom-10 w-24 rotate-12 sm:w-32", delay: "-5.2s" },
];

export function SubscriptionTrialBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {BACKDROP_FACES.map((face) => (
        <Face
          key={face.faceId}
          faceId={face.faceId}
          size={160}
          priority
          className={cn(
            "absolute h-auto opacity-25 blur-[1px] motion-safe:animate-mood-float",
            face.className,
          )}
          style={{ animationDelay: face.delay }}
        />
      ))}
    </div>
  );
}
