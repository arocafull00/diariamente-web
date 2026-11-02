import { Face } from "@/components/faces/face";
import type { FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

type PanelFace = {
  faceId: FaceId;
  className: string;
  delay: string;
};

const panelFaces: PanelFace[] = [
  { faceId: "alegria", className: "left-[34%] top-[26%] z-10 w-[32%]", delay: "0s" },
  { faceId: "04_naranja_amarillo", className: "left-[6%] top-[6%] w-[17%] -rotate-12", delay: "-1.2s" },
  { faceId: "02_azul_rosa", className: "left-[30%] top-[2%] w-[12%] rotate-12", delay: "-3.4s" },
  { faceId: "tristeza", className: "right-[24%] top-[6%] w-[15%] -rotate-6", delay: "-2.1s" },
  { faceId: "05_rosa_verde", className: "right-[3%] top-[1%] w-[14%] rotate-6", delay: "-4.4s" },
  { faceId: "ansiedad", className: "left-[2%] top-[34%] w-[20%] rotate-6", delay: "-5.3s" },
  { faceId: "01_gradiente", className: "left-[22%] top-[24%] w-[10%] -rotate-12", delay: "-0.7s" },
  { faceId: "03_verde_morado", className: "right-[4%] top-[28%] w-[21%] -rotate-12", delay: "-3.9s" },
  { faceId: "rabia", className: "right-[25%] top-[22%] w-[9%] rotate-12", delay: "-6.1s" },
  { faceId: "02_azul_rosa", className: "left-[8%] bottom-[8%] w-[15%] -rotate-6", delay: "-2.8s" },
  { faceId: "05_rosa_verde", className: "left-[28%] bottom-[2%] w-[18%] rotate-12", delay: "-4.9s" },
  { faceId: "04_naranja_amarillo", className: "right-[30%] bottom-[10%] w-[11%] -rotate-12", delay: "-1.6s" },
  { faceId: "tristeza", className: "right-[6%] bottom-[4%] w-[17%] rotate-6", delay: "-5.7s" },
  { faceId: "01_gradiente", className: "right-[22%] bottom-[34%] w-[8%] rotate-6", delay: "-3.1s" },
  { faceId: "03_verde_morado", className: "left-[22%] bottom-[30%] w-[9%] -rotate-6", delay: "-0.3s" },
];

export function AuthFacesPanel() {
  return (
    <aside className="sticky top-0 hidden h-svh flex-1 p-4 lg:flex">
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[2.5rem] bg-mood-lp-soft ring-1 ring-mood-lp-1">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--mood-lp-1)_1px,transparent_1px),linear-gradient(to_bottom,var(--mood-lp-1)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70"
        />
        <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-mood-hp-1/60 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -left-24 size-72 rounded-full bg-mood-lu-1/60 blur-3xl" />
        <div className="relative flex flex-1 items-center justify-center px-10 pt-10">
          <div aria-hidden className="relative aspect-square w-full max-w-xl">
            {panelFaces.map((face, index) => (
              <Face
                key={`${face.faceId}-${index}`}
                faceId={face.faceId}
                size={200}
                priority
                className={cn(
                  "absolute h-auto drop-shadow-md motion-safe:animate-mood-float",
                  face.className,
                )}
                style={{ animationDelay: face.delay }}
              />
            ))}
          </div>
        </div>
        <div className="relative px-10 pb-12 text-center">
          <h2 className="mx-auto max-w-md font-display text-3xl leading-tight font-medium text-balance text-foreground xl:text-4xl">
            Todas tus emociones caben{" "}
            <span className="text-mood-lp-strong italic">aquí</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-6 text-pretty text-muted-foreground">
            Apunta cómo te sientes, descubre qué se repite y compártelo con tu
            psicólogo/a cuando te apetezca.
          </p>
        </div>
      </div>
    </aside>
  );
}
