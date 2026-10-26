import { AccessLogItem } from "./access-log-item";

import { Face } from "@/components/faces/face";

type AccessLogListProps = {
  entries: (React.ComponentProps<typeof AccessLogItem> & { id: string })[];
};

export function AccessLogList({ entries }: AccessLogListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-border/60">
        <Face
          faceId="05_rosa_verde"
          size={64}
          className="mx-auto mb-4 size-14 rotate-6 drop-shadow-sm motion-safe:animate-mood-float"
        />
        Ningún profesional ha consultado todavía tus registros.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
      {entries.map(({ id, ...entry }) => (
        <AccessLogItem key={id} {...entry} />
      ))}
    </ul>
  );
}
