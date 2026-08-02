import { LoaderCircle } from "lucide-react";

export function AppLoading() {
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      <LoaderCircle
        className="size-9 animate-spin text-primary"
        aria-hidden="true"
      />
      <span className="sr-only">Cargando la aplicación</span>
    </div>
  );
}
