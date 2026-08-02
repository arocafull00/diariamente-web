type ProfileSectionCardProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function ProfileSectionCard({
  title,
  action,
  children,
}: ProfileSectionCardProps) {
  return (
    <section className="rounded-2xl bg-secondary p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
