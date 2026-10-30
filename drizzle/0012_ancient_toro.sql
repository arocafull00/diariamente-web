CREATE TYPE "public"."feedback_ease" AS ENUM('easy', 'neutral', 'hard');--> statement-breakpoint
CREATE TYPE "public"."feedback_kind" AS ENUM('idea', 'bug', 'other');--> statement-breakpoint
CREATE TYPE "public"."feedback_status" AS ENUM('new', 'reviewed', 'done');--> statement-breakpoint
CREATE TYPE "public"."feedback_trigger" AS ENUM('profile', 'sidebar', 'streak');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL,
	"role" "user_role" NOT NULL,
	"trigger" "feedback_trigger" NOT NULL,
	"kind" "feedback_kind",
	"ease" "feedback_ease",
	"message" text DEFAULT '' NOT NULL,
	"wants_call" boolean DEFAULT false NOT NULL,
	"client_context" jsonb,
	"status" "feedback_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "feedback_prompted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "feedback_status_created_at_idx" ON "feedback" USING btree ("status","created_at");