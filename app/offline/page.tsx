import { Face } from "@/components/faces/face";

export default function OfflinePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <Face
        faceId="tristeza"
        size={96}
        priority
        className="mb-6 size-24 drop-shadow-sm motion-safe:animate-mood-float"
      />
      <h1 className="text-xl font-semibold">Sin conexión</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No hay conexión a internet. Vuelve a intentarlo más tarde.
      </p>
    </div>
  );
}
