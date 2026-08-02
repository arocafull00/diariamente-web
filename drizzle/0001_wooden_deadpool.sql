CREATE TYPE "public"."connection_request_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
DROP TABLE "invitations" CASCADE;--> statement-breakpoint
CREATE TABLE "connection_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"psychologist_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"status" "connection_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "connection_requests_pair_unique" UNIQUE("psychologist_id","patient_id")
);
--> statement-breakpoint
CREATE TABLE "invite_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"psychologist_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invite_links_token_unique" UNIQUE("token"),
	CONSTRAINT "invite_links_psychologist_id_unique" UNIQUE("psychologist_id")
);
--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_patient_id_profiles_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_links" ADD CONSTRAINT "invite_links_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
