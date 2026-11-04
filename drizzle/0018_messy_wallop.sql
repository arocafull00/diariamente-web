CREATE TABLE "record_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" uuid NOT NULL,
	"psychologist_id" text NOT NULL,
	"content" text NOT NULL,
	"seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "record_replies_record_psychologist_unique" UNIQUE("record_id","psychologist_id")
);
--> statement-breakpoint
ALTER TABLE "record_replies" ADD CONSTRAINT "record_replies_record_id_patient_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."patient_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "record_replies" ADD CONSTRAINT "record_replies_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;