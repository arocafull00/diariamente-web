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
    <div className="space-y-2">
      <h3 className="font-medium">Solicitudes de conexión</h3>
      <div className="space-y-2">
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
    </div>
  );
}
