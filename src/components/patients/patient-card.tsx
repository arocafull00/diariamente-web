import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials, getFullName } from "@/lib/utils-app";

type PatientCardProps = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  unseenCount: number;
};

export function PatientCard({
  id,
  firstName,
  lastName,
  avatarUrl,
  unseenCount,
}: PatientCardProps) {
  return (
    <Link href={`/pacientes/${id}`}>
      <Card className="transition-colors hover:bg-secondary/50">
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar className="size-12">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback>
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {getFullName(firstName, lastName)}
            </p>
          </div>
          {unseenCount > 0 ? (
            <Badge variant="default">
              {unseenCount > 99 ? "99+" : unseenCount}
            </Badge>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
