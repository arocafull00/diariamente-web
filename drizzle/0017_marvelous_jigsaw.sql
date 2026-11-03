CREATE TYPE "public"."acquisition_source" AS ENUM('instagram', 'tiktok', 'google', 'psychologist', 'colleague', 'friends', 'linkedin', 'app_store', 'other');--> statement-breakpoint
CREATE TYPE "public"."caseload" AS ENUM('starting', 'up_to_10', 'up_to_30', 'more_than_30');--> statement-breakpoint
CREATE TYPE "public"."onboarding_goal" AS ENUM('understand', 'therapy', 'anxiety', 'vent', 'context', 'homework', 'progress', 'time');--> statement-breakpoint
CREATE TYPE "public"."records_experience" AS ENUM('never', 'paper', 'with_psychologist');--> statement-breakpoint
CREATE TYPE "public"."therapy_status" AS ENUM('in_therapy', 'looking', 'not_yet');--> statement-breakpoint
CREATE TABLE "onboarding_answers" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"acquisition_source" "acquisition_source" NOT NULL,
	"goal" "onboarding_goal",
	"therapy_status" "therapy_status",
	"records_experience" "records_experience",
	"caseload" "caseload",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onboarding_answers" ADD CONSTRAINT "onboarding_answers_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;