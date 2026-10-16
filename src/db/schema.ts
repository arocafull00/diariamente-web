import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "patient",
  "psychologist",
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

export const connectionRequestStatusEnum = pgEnum("connection_request_status", [
  "pending",
  "accepted",
  "rejected",
]);

export type RecordEmotion = {
  emotion: string;
  intensity: number;
};

export type BodySensation = {
  region: string;
  pleasantness: number;
  intensity: number;
  tags: string[];
};

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
  onboardingCompleted: boolean("onboarding_completed")
    .default(false)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const patientRecords = pgTable("patient_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: text("patient_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
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
    .$type<BodySensation[]>()
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
      .references(() => profiles.id, { onDelete: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    linkedAt: timestamp("linked_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("psychologist_patient_patient_id_unique").on(table.patientId)],
);

export const recordNotes = pgTable("record_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  recordId: uuid("record_id")
    .notNull()
    .references(() => patientRecords.id, { onDelete: "cascade" })
    .unique(),
  psychologistId: text("psychologist_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const inviteLinks = pgTable("invite_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  psychologistId: text("psychologist_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade" }),
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
      .references(() => profiles.id, { onDelete: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    status: connectionRequestStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
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
      .references(() => profiles.id, { onDelete: "cascade" }),
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
    .references(() => profiles.id, { onDelete: "cascade" }),
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
    .references(() => profiles.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: text("actor_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type PatientRecord = typeof patientRecords.$inferSelect;
export type RecordNote = typeof recordNotes.$inferSelect;
export type CustomEmotion = typeof customEmotions.$inferSelect;
export type InviteLink = typeof inviteLinks.$inferSelect;
export type ConnectionRequest = typeof connectionRequests.$inferSelect;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type EmotionIntensity = (typeof emotionIntensityEnum.enumValues)[number];
export type MoodQuadrant = (typeof moodQuadrantEnum.enumValues)[number];
export type BodyFigure = (typeof bodyFigureEnum.enumValues)[number];
