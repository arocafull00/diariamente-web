CREATE TYPE "public"."mood_quadrant" AS ENUM('HIGH_UNPLEASANT', 'HIGH_PLEASANT', 'LOW_UNPLEASANT', 'LOW_PLEASANT');--> statement-breakpoint
ALTER TABLE "patient_records" ALTER COLUMN "situation" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "patient_records" ALTER COLUMN "thoughts" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "patient_records" ALTER COLUMN "behaviours" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "custom_emotions" ADD COLUMN "quadrant" "mood_quadrant";--> statement-breakpoint
ALTER TABLE "patient_records" ADD COLUMN "quadrant" "mood_quadrant";--> statement-breakpoint
ALTER TABLE "patient_records" ADD COLUMN "context" jsonb DEFAULT '{"topics":[],"people":[],"places":[]}'::jsonb NOT NULL;