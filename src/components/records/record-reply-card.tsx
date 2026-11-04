import { MessageCircleHeart } from "lucide-react";

type RecordReplyCardProps = {
  title: string;
  content: string | null;
  placeholder?: string;
  unseen?: boolean;
  action?: React.ReactNode;
};

export function RecordReplyCard({
  title,
  content,
  placeholder,
  unseen = false,
  action,
}: RecordReplyCardProps) {
  return (
    <section className="space-y-3 rounded-3xl bg-mood-lu-soft p-5 shadow-xs ring-1 ring-border/50">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-mood-lu-strong shadow-xs"
        >
          <MessageCircleHeart className="size-5" />
        </span>
        <h2 className="min-w-0 flex-1 text-[0.95rem] font-semibold text-mood-lu-strong">
          {title}
        </h2>
        {unseen ? (
          <span className="rounded-full bg-mood-hu-3 px-2.5 py-0.5 text-xs font-bold text-mood-foreground">
            Nueva
          </span>
        ) : null}
      </div>
      {content ? (
        <p className="font-display text-lg leading-snug font-medium whitespace-pre-wrap text-pretty text-foreground">
          {content}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
      {action ? <div className="flex justify-end">{action}</div> : null}
    </section>
  );
}
