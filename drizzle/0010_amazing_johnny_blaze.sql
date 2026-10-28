ALTER TABLE "audit_events" DROP CONSTRAINT "audit_events_actor_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "connection_requests" DROP CONSTRAINT "connection_requests_psychologist_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "connection_requests" DROP CONSTRAINT "connection_requests_patient_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_emotions" DROP CONSTRAINT "custom_emotions_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "invite_links" DROP CONSTRAINT "invite_links_psychologist_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "patient_records" DROP CONSTRAINT "patient_records_patient_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "psychologist_patient" DROP CONSTRAINT "psychologist_patient_psychologist_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "psychologist_patient" DROP CONSTRAINT "psychologist_patient_patient_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "push_subscriptions" DROP CONSTRAINT "push_subscriptions_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "record_notes" DROP CONSTRAINT "record_notes_psychologist_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "screen_acknowledgements" DROP CONSTRAINT "screen_acknowledgements_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "therapy_sessions" DROP CONSTRAINT "therapy_sessions_psychologist_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "therapy_sessions" DROP CONSTRAINT "therapy_sessions_patient_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_reminders" DROP CONSTRAINT "user_reminders_user_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_patient_id_profiles_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "custom_emotions" ADD CONSTRAINT "custom_emotions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "invite_links" ADD CONSTRAINT "invite_links_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "patient_records" ADD CONSTRAINT "patient_records_patient_id_profiles_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "psychologist_patient" ADD CONSTRAINT "psychologist_patient_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "psychologist_patient" ADD CONSTRAINT "psychologist_patient_patient_id_profiles_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "record_notes" ADD CONSTRAINT "record_notes_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "screen_acknowledgements" ADD CONSTRAINT "screen_acknowledgements_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "therapy_sessions" ADD CONSTRAINT "therapy_sessions_psychologist_id_profiles_id_fk" FOREIGN KEY ("psychologist_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "therapy_sessions" ADD CONSTRAINT "therapy_sessions_patient_id_profiles_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_reminders" ADD CONSTRAINT "user_reminders_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;