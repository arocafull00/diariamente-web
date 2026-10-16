CREATE TYPE "public"."body_figure" AS ENUM('masculine', 'feminine');--> statement-breakpoint
ALTER TABLE "patient_records" ADD COLUMN "body_sensations" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "body_figure" "body_figure";