export default function OfflinePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-semibold">Sin conexión</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No hay conexión a internet. Vuelve a intentarlo más tarde.
      </p>
    </div>
  );
}
