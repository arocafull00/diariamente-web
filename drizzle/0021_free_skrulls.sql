ALTER TABLE "invite_links" ADD COLUMN "code" text;--> statement-breakpoint
UPDATE "invite_links" SET "code" = (
  SELECT string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', floor(random() * 32)::int + 1, 1), '')
  FROM generate_series(1, 6)
  WHERE "invite_links"."id" IS NOT NULL
);--> statement-breakpoint
ALTER TABLE "invite_links" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invite_links" ADD CONSTRAINT "invite_links_code_unique" UNIQUE("code");
