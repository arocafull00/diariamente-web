CREATE TABLE "signup_attribution" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"channel" text,
	"platform" text NOT NULL,
	"landing_host" text,
	"registered_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "signup_attribution" ADD CONSTRAINT "signup_attribution_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "signup_attribution_registered_at_idx" ON "signup_attribution" USING btree ("registered_at");