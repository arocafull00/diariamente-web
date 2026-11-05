import { FaceRow } from "@/components/faces/face-row";
import { DECORATIVE_FACE_IDS } from "@/lib/faces";

export function PatientsSearchEmpty() {
  return (
    <div className="rounded-[2rem] bg-card/80 px-5 py-8 text-center shadow-sm ring-1 ring-border/50 backdrop-blur lg:col-span-2 xl:col-span-3">
      <div className="mb-5">
        <FaceRow faceIds={DECORATIVE_FACE_IDS.slice(0, 3)} className="size-12" />
      </div>
      <h3 className="font-display text-xl leading-tight font-medium text-balance">
        Nadie con ese{" "}
        <span className="text-mood-lu-strong italic">nombre</span>
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
        Revisa cómo lo has escrito o prueba solo con el nombre.
      </p>
    </div>
  );
}
