import { Face } from "@/components/faces/face";
import type { FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

type FaceRowProps = {
  faceIds: readonly FaceId[];
  className?: string;
};

export function FaceRow({ faceIds, className }: FaceRowProps) {
  return (
    <div className="mx-auto flex w-fit -space-x-3" aria-hidden="true">
      {faceIds.map((faceId, index) => (
        <Face
          key={faceId}
          faceId={faceId}
          size={64}
          className={cn(
            "size-12 drop-shadow-sm motion-safe:animate-mood-float",
            index % 2 ? "rotate-6" : "-rotate-6",
            className,
          )}
          style={{ animationDelay: `${-index * 1.3}s` }}
        />
      ))}
    </div>
  );
}
