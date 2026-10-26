import { Face } from "@/components/faces/face";
import type { FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

type LoginFacePlacement = {
  faceId: FaceId;
  className: string;
  delay: string;
};

const loginFacePlacements: LoginFacePlacement[] = [
  { faceId: "04_naranja_amarillo", className: "left-[2%] top-[10%] w-[27%] -rotate-12", delay: "-1.2s" },
  { faceId: "02_azul_rosa", className: "right-[3%] top-[2%] w-[23%] rotate-12", delay: "-3.4s" },
  { faceId: "03_verde_morado", className: "bottom-[2%] left-[10%] w-[21%] rotate-6", delay: "-5.1s" },
  { faceId: "05_rosa_verde", className: "bottom-[6%] right-[6%] w-[25%] -rotate-6", delay: "-2.3s" },
  { faceId: "01_gradiente", className: "left-[33%] top-0 w-[13%] rotate-12", delay: "-4.6s" },
  { faceId: "alegria", className: "left-[29%] top-[14%] z-10 w-[42%]", delay: "0s" },
];

export function LoginFaces() {
  return (
    <div aria-hidden className="relative mx-auto aspect-[3/2] w-full max-w-80">
      {loginFacePlacements.map((placement) => (
        <Face
          key={placement.faceId}
          faceId={placement.faceId}
          size={160}
          priority
          className={cn(
            "absolute h-auto drop-shadow-sm motion-safe:animate-mood-float",
            placement.className,
          )}
          style={{ animationDelay: placement.delay }}
        />
      ))}
    </div>
  );
}
