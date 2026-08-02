import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de conexión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {requests.map((request) => (
          <ConnectionRequestItem
            key={request.id}
            id={request.id}
            firstName={request.firstName}
            lastName={request.lastName}
            avatarUrl={request.avatarUrl}
          />
        ))}
      </CardContent>
    </Card>
  );
}
