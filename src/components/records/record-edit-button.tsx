import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

type RecordEditButtonProps = {
  label: string;
  onClick: () => void;
};

export function RecordEditButton({ label, onClick }: RecordEditButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Pencil data-icon="inline-start" aria-hidden="true" />
      {label}
    </Button>
  );
}
