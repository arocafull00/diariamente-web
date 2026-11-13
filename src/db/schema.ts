import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import {
  ACQUISITION_SOURCES,
  CASELOADS,
  ONBOARDING_GOALS,
  RECORDS_EXPERIENCES,
  THERAPY_STATUSES,
} from "../lib/onboarding-answers";

export const userRoleEnum = pgEnum("user_role", [
  "patient",
  "psychologist",
  "clinic",
  "admin",
]);

export const emotionIntensityEnum = pgEnum("emotion_intensity", [
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const moodQuadrantEnum = pgEnum("mood_quadrant", [
  "HIGH_UNPLEASANT",
  "HIGH_PLEASANT",
  "LOW_UNPLEASANT",
  "LOW_PLEASANT",
]);

export const bodyFigureEnum = pgEnum("body_figure", ["masculine", "feminine"]);

export const grammaticalGenderEnum = pgEnum("grammatical_gender", [
  "feminine",
  "masculine",
  "unspecified",
]);

export const requiredScreenEnum = pgEnum("required_screen", ["welcome", "terms"]);

export const connectionRequestStatusEnum = pgEnum("connection_request_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const acquisitionSourceEnum = pgEnum("acquisition_source", ACQUISITION_SOURCES);

export const onboardingGoalEnum = pgEnum("onboarding_goal", ONBOARDING_GOALS);

export const therapyStatusEnum = pgEnum("therapy_status", THERAPY_STATUSES);

export const recordsExperienceEnum = pgEnum("records_experience", RECORDS_EXPERIENCES);

export const caseloadEnum = pgEnum("caseload", CASELOADS);

export const feedbackKindEnum = pgEnum("feedback_kind", ["idea", "bug", "other"]);

export const feedbackEaseEnum = pgEnum("feedback_ease", ["easy", "neutral", "hard"]);

export const feedbackTriggerEnum = pgEnum("feedback_trigger", [
  "profile",
  "sidebar",
  "streak",
]);

export const feedbackStatusEnum = pgEnum("feedback_status", [
  "new",
  "reviewed",
  "done",
]);

export type FeedbackClientContext = {
  path: string;
  standalone: boolean;
  userAgent: string;
};

export type RecordEmotion = {
  emotion: string;
  intensity: number;
};

export type BodySide = "front" | "back";

export type BodySensation = {
  id: string;
  x: number;
  y: number;
  side: BodySide;
  pleasantness: number;
  intensity: number;
  tags: string[];
};

export type UnsidedBodySensation = Omit<BodySensation, "side">;

export type LegacyBodySensation = Omit<BodySensation, "id" | "x" | "y" | "side"> & {
  region: string;
};

export type StoredBodySensation = BodySensation | UnsidedBodySensation | LegacyBodySensation;

export type RecordContext = {
  topics: string[];
  people: string[];
  places: string[];
};

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: userRoleEnum("role"),
  avatarUrl: text("avatar_url"),
  bodyFigure: bodyFigureEnum("body_figure"),
  grammaticalGender: grammaticalGenderEnum("grammatical_gender")
    .default("feminine")
    .notNull(),
  onboardingCompleted: boolean("onboarding_completed")
    .default(false)
    .notNull(),
  feedbackPromptedAt: timestamp("feedback_prompted_at", { withTimezone: true }),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  lifetimeAccess: boolean("lifetime_access").default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  referralCode: text("referral_code").unique(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const signupAttribution = pgTable("signup_attribution", {
  profileId: text("profile_id").primaryKey().references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  channel: text("channel", { enum: ["linkedin", "instagram", "facebook", "web"] }),
  platform: text("platform", { enum: ["web", "android"] }).notNull(),
  landingHost: text("landing_host", { enum: ["info.diariamente.es", "clinicas.diariamente.es", "pacientes.diariamente.es"] }),
  registeredAt: timestamp("registered_at", { withTimezone: true }).notNull(),
}, (table) => [index("signup_attribution_registered_at_idx").on(table.registeredAt)]);

export const patientRecords = pgTable("patient_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: text("patient_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  situation: text("situation").default("").notNull(),
  thoughts: text("thoughts").default("").notNull(),
  behaviours: text("behaviours").default("").notNull(),
  emotions: jsonb("emotions").$type<RecordEmotion[]>().notNull(),
  quadrant: moodQuadrantEnum("quadrant"),
  context: jsonb("context")
    .$type<RecordContext>()
    .default({ topics: [], people: [], places: [] })
    .notNull(),
  bodySensations: jsonb("body_sensations")
    .$type<StoredBodySensation[]>()
    .default([])
    .notNull(),
  emotionIntensity: emotionIntensityEnum("emotion_intensity").notNull(),
  seenAt: timestamp("seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const psychologistPatient = pgTable(
  "psychologist_patient",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    psychologistId: text("psychologist_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    linkedAt: timestamp("linked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("psychologist_patient_patient_id_unique").on(table.patientId)],
);

export const clinics = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  stripePriceId: text("stripe_price_id"),
  monthlyPriceCents: integer("monthly_price_cents"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referrerId: text("referrer_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    referredId: text("referred_id")
      .notNull()
      .unique()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rewardedAt: timestamp("rewarded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("referrals_referrer_id_idx").on(table.referrerId)],
);

export const clinicInviteLinks = pgTable("clinic_invite_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  clinicId: uuid("clinic_id")
    .notNull()
    .unique()
    .references(() => clinics.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const clinicPsychologists = pgTable(
  "clinic_psychologists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
      .notNull()
      .references(() => clinics.id, { onDelete: "cascade" }),
    psychologistId: text("psychologist_id")
      .notNull()
      .unique()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("clinic_psychologists_clinic_id_idx").on(table.clinicId)],
);

export const therapySessions = pgTable(
  "therapy_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    psychologistId: text("psychologist_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    heldAt: timestamp("held_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("therapy_sessions_pair_held_at_idx").on(
      table.psychologistId,
      table.patientId,
      table.heldAt,
    ),
  ],
);

export const recordNotes = pgTable(
  "record_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recordId: uuid("record_id")
      .notNull()
      .references(() => patientRecords.id, { onDelete: "cascade" }),
    psychologistId: text("psychologist_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("record_notes_record_psychologist_unique").on(
      table.recordId,
      table.psychologistId,
    ),
  ],
);

export const inviteLinks = pgTable("invite_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  psychologistId: text("psychologist_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const connectionRequests = pgTable(
  "connection_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    psychologistId: text("psychologist_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    status: connectionRequestStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    consentedAt: timestamp("consented_at", { withTimezone: true }),
  },
  (table) => [
    unique("connection_requests_pair_unique").on(
      table.psychologistId,
      table.patientId,
    ),
  ],
);

export const customEmotions = pgTable(
  "custom_emotions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    quadrant: moodQuadrantEnum("quadrant"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("custom_emotions_user_name_unique").on(table.userId, table.name)],
);

export const userReminders = pgTable("user_reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  enabled: boolean("enabled").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const screenAcknowledgements = pgTable(
  "screen_acknowledgements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    screen: requiredScreenEnum("screen").notNull(),
    version: integer("version").notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("screen_acknowledgements_profile_screen_version_unique").on(
      table.profileId,
      table.screen,
      table.version,
    ),
  ],
);

export const onboardingAnswers = pgTable("onboarding_answers", {
  profileId: text("profile_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  acquisitionSource: acquisitionSourceEnum("acquisition_source").notNull(),
  goal: onboardingGoalEnum("goal"),
  therapyStatus: therapyStatusEnum("therapy_status"),
  recordsExperience: recordsExperienceEnum("records_experience"),
  caseload: caseloadEnum("caseload"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: text("actor_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_events_action_entity_idx").on(table.action, table.entityId),
    index("audit_events_created_at_idx").on(table.createdAt),
  ],
);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    role: userRoleEnum("role").notNull(),
    trigger: feedbackTriggerEnum("trigger").notNull(),
    kind: feedbackKindEnum("kind"),
    ease: feedbackEaseEnum("ease"),
    message: text("message").default("").notNull(),
    wantsCall: boolean("wants_call").default(false).notNull(),
    clientContext: jsonb("client_context").$type<FeedbackClientContext>(),
    status: feedbackStatusEnum("status").default("new").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("feedback_status_created_at_idx").on(table.status, table.createdAt)],
);

export type Profile = typeof profiles.$inferSelect;
export type PatientRecord = typeof patientRecords.$inferSelect;
export type RecordNote = typeof recordNotes.$inferSelect;
export type CustomEmotion = typeof customEmotions.$inferSelect;
export type InviteLink = typeof inviteLinks.$inferSelect;
export type ConnectionRequest = typeof connectionRequests.$inferSelect;
export type Clinic = typeof clinics.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type EmotionIntensity = (typeof emotionIntensityEnum.enumValues)[number];
export type MoodQuadrant = (typeof moodQuadrantEnum.enumValues)[number];
export type RequiredScreen = (typeof requiredScreenEnum.enumValues)[number];
export type BodyFigure = (typeof bodyFigureEnum.enumValues)[number];
export type GrammaticalGender =
  (typeof grammaticalGenderEnum.enumValues)[number];
export type AcquisitionSource = (typeof acquisitionSourceEnum.enumValues)[number];
export type OnboardingGoal = (typeof onboardingGoalEnum.enumValues)[number];
export type TherapyStatus = (typeof therapyStatusEnum.enumValues)[number];
export type RecordsExperience = (typeof recordsExperienceEnum.enumValues)[number];
export type Caseload = (typeof caseloadEnum.enumValues)[number];
export type FeedbackKind = (typeof feedbackKindEnum.enumValues)[number];
export type FeedbackEase = (typeof feedbackEaseEnum.enumValues)[number];
export type FeedbackTrigger = (typeof feedbackTriggerEnum.enumValues)[number];
