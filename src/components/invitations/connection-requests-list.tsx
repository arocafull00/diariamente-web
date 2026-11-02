import { ConnectionRequestItem } from "./connection-request-item";

type ConnectionRequest = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type ConnectionRequestsListProps = {
  requests: ConnectionRequest[];
};

export function ConnectionRequestsList({ requests }: ConnectionRequestsListProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-2 px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Solicitudes de conexión
        <span className="rounded-full bg-mood-hp-soft px-2 py-0.5 text-[0.7rem] font-bold text-mood-hp-strong tabular-nums">
          {requests.length}
        </span>
      </h3>
      <div className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
        {requests.map((request) => (
          <ConnectionRequestItem
            key={request.id}
            id={request.id}
            firstName={request.firstName}
            lastName={request.lastName}
            avatarUrl={request.avatarUrl}
          />
        ))}
      </div>
    </section>
  );
}
