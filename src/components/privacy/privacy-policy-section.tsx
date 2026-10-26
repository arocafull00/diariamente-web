type PrivacyPolicySectionProps = {
  title: string;
  paragraphs: string[];
};

export function PrivacyPolicySection({ title, paragraphs }: PrivacyPolicySectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
