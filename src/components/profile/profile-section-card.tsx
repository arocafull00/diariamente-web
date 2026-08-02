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
    <section className="flex h-full flex-col rounded-2xl bg-secondary p-4 lg:border lg:border-border lg:bg-card lg:p-5 lg:shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3 lg:mb-4">
        <h2 className="text-sm font-semibold text-primary lg:text-base">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
