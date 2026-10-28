type TermsOfServiceSectionProps = {
  id: string;
  title: string;
  paragraphs: string[];
};

export function TermsOfServiceSection({
  id,
  title,
  paragraphs,
}: TermsOfServiceSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="font-display text-xl font-medium text-balance">
        {title}
      </h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
