ALTER TYPE "public"."user_role" ADD VALUE 'clinic' BEFORE 'admin';--> statement-breakpoint
CREATE TABLE "clinic_invite_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"clinic_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clinic_invite_links_token_unique" UNIQUE("token"),
	CONSTRAINT "clinic_invite_links_clinic_id_unique" UNIQUE("clinic_id")
);
--> statement-breakpoint
CREATE TABLE "clinic_psychologists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"psychologist_id" text NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consented_at" timestamp with time zone NOT NULL,
	CONSTRAINT "clinic_psychologists_psychologist_id_unique" UNIQUE("psychologist_id")
);
--> statement-breakpoint
CREATE TABLE "clinics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clinics_owner_id_unique" UNIQUE("owner_id")
);
--> statement-breakpoint
ALTER TABLE "clinic_invite_links" ADD CONSTRAINT "clinic_invite_links_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_psychologists" ADD CONSTRAINT "clinic_psychologists_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_psychologists" ADD CONSTRAINT "clinic_psychologists_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "clinic_psychologists_clinic_id_idx" ON "clinic_psychologists" USING btree ("clinic_id");