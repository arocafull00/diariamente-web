type ProfileSectionCardProps = {
  title: string;
  children: React.ReactNode;
};

export function ProfileSectionCard({ title, children }: ProfileSectionCardProps) {
  return (
    <section className="flex h-full flex-col gap-2">
      <h2 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-1 flex-col rounded-3xl border border-border/60 bg-card p-4 shadow-xs lg:p-5">
        {children}
      </div>
    </section>
  );
}
