import { Face } from "@/components/faces/face";
import {
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { FaceId } from "@/lib/faces";

type SettingsConfirmHeaderProps = {
  faceId: FaceId;
  title: React.ReactNode;
  description: string;
};

export function SettingsConfirmHeader({
  faceId,
  title,
  description,
}: SettingsConfirmHeaderProps) {
  return (
    <AlertDialogHeader className="place-items-center gap-2 text-center sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center">
      <Face
        faceId={faceId}
        size={64}
        className="mb-1 size-14 -rotate-6 drop-shadow-sm motion-safe:animate-mood-float"
      />
      <AlertDialogTitle className="font-display text-2xl leading-tight font-medium text-balance">
        {title}
      </AlertDialogTitle>
      <AlertDialogDescription className="max-w-xs leading-6">
        {description}
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
}
