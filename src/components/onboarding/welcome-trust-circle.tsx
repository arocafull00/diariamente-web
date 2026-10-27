import { Face } from "@/components/faces/face";

export function WelcomeTrustCircle() {
  return (
    <div className="rounded-3xl border-2 border-border bg-card px-5 py-6 text-center">
      <div className="flex items-end justify-center gap-3" aria-hidden="true">
        <div className="flex flex-col items-center gap-2">
          <Face
            faceId="alegria"
            size={128}
            className="size-20 -rotate-6 drop-shadow-md motion-safe:animate-mood-float"
          />
          <span className="text-sm font-semibold">Tú</span>
        </div>
        <span className="mb-14 h-0 w-10 border-t-2 border-dashed border-foreground/25" />
        <div className="flex flex-col items-center gap-2">
          <Face
            faceId="01_gradiente"
            size={128}
            className="size-20 rotate-6 drop-shadow-md motion-safe:animate-mood-float"
            style={{ animationDelay: "-2.4s" }}
          />
          <span className="text-sm font-semibold">Tu psicólogo/a</span>
        </div>
      </div>
      <p className="mt-5 text-pretty text-base font-semibold">
        Solo vosotros dos veréis lo que escribas.
      </p>
      <p className="mt-1 text-pretty text-sm leading-5 text-foreground/65">
        Así podréis hablarlo juntos en la próxima sesión.
      </p>
    </div>
  );
}
