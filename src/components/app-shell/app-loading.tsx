import { Face } from "@/components/faces/face";

export function AppLoading() {
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      <Face
        faceId="01_gradiente"
        size={64}
        priority
        className="size-14 drop-shadow-sm motion-safe:animate-bounce"
      />
      <span className="sr-only">Cargando la aplicación</span>
    </div>
  );
}
