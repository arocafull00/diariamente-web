ALTER TABLE "user_reminders" DROP COLUMN "frequency";--> statement-breakpoint
ALTER TABLE "user_reminders" DROP COLUMN "time";--> statement-breakpoint
ALTER TABLE "user_reminders" DROP COLUMN "days";--> statement-breakpoint
DROP TYPE "public"."reminder_frequency";