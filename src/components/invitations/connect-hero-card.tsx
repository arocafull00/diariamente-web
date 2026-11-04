import { FaceRow } from "@/components/faces/face-row";
import type { FaceId } from "@/lib/faces";

type ConnectHeroCardProps = {
  faceIds: readonly FaceId[];
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
};

export function ConnectHeroCard({
  faceIds,
  title,
  description,
  children,
}: ConnectHeroCardProps) {
  return (
    <section className="flex w-full max-w-md flex-col gap-6 rounded-[2rem] bg-card/80 px-5 py-6 text-center shadow-sm ring-1 ring-border/50 backdrop-blur sm:px-6 sm:py-8">
      <div className="space-y-3">
        <FaceRow faceIds={faceIds} />
        <h1 className="font-display text-3xl leading-tight font-medium text-balance">
          {title}
        </h1>
        <p className="mx-auto max-w-xs text-sm leading-6 text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
