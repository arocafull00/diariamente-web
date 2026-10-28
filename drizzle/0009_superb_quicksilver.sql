CREATE TYPE "public"."required_screen" AS ENUM('welcome');--> statement-breakpoint
CREATE TABLE "screen_acknowledgements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL,
	"screen" "required_screen" NOT NULL,
	"version" integer NOT NULL,
	"acknowledged_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "screen_acknowledgements_profile_screen_version_unique" UNIQUE("profile_id","screen","version")
);
--> statement-breakpoint
ALTER TABLE "screen_acknowledgements" ADD CONSTRAINT "screen_acknowledgements_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "screen_acknowledgements" ("profile_id", "screen", "version") SELECT "id", 'welcome', 1 FROM "profiles" WHERE "onboarding_completed" = true ON CONFLICT DO NOTHING;