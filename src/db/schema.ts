import {
  pgTable,
  text,
  integer,
  decimal,
  timestamp,
  date,
  varchar,
  boolean,
  real,
  jsonb,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "next-auth/adapters";

// ======================================================================
// AUTHENTICATION TABLES - NextAuth.js integration
// ======================================================================

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // For credentials provider
  role: varchar("role", { length: 50 }).notNull().default("user"), // admin, manager, engineer, user
  organizationId: integer("organization_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}));

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// ======================================================================
// ORGANIZATIONS & SUBSCRIPTIONS - Multi-tenant support
// ======================================================================

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  planType: varchar("plan_type", { length: 50 }).notNull().default("free_trial"), // free_trial, basic, professional, enterprise
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("trialing"), // trialing, active, past_due, canceled
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  maxProjects: integer("max_projects").default(1),
  maxUsers: integer("max_users").default(3),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionEvents = pgTable("subscription_events", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(), // trial_started, subscription_created, payment_succeeded, etc.
  eventData: jsonb("event_data"),
  stripeEventId: text("stripe_event_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================================================================
// PROJECTS TABLE - Main project registry (Updated with userId)
// ======================================================================
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  clientName: text("client_name").notNull(),
  overallBudget: decimal("overall_budget", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, on-hold, completed
  startDate: date("start_date"),
  endDate: date("end_date"),
  projectManager: text("project_manager"),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================================================================
// DAILY SITE REPORTS - Field execution logs
// ======================================================================
export const dailySiteReports = pgTable("daily_site_reports", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  reportDate: date("report_date").notNull(),
  
  // Weather & Site Conditions
  tempMin: real("temp_min"), // °C
  tempMax: real("temp_max"), // °C
  humidity: real("humidity"), // %
  windSpeed: real("wind_speed"), // km/h
  weatherCondition: varchar("weather_condition", { length: 50 }), // sunny, cloudy, rainy, etc.
  
  // Workforce
  totalWorkers: integer("total_workers").notNull().default(0),
  workforceBreakdown: jsonb("workforce_breakdown"), // { "steel_fixers": 12, "carpenters": 8, ... }
  
  // HSE & Safety
  hseStatus: varchar("hse_status", { length: 50 }).default("compliant"), // compliant, incident, near-miss
  zeroDaysIncident: integer("zero_days_incident").default(0),
  safetyNotes: text("safety_notes"),
  
  // General Notes
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================================================================
// CONCRETE POURS - Structural concrete QC logs
// ======================================================================
export const concretePours = pgTable("concrete_pours", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => dailySiteReports.id, { onDelete: "cascade" })
    .notNull(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  
  elementLocation: text("element_location").notNull(), // e.g., "Column C3-L4", "Slab Floor 3"
  mixDesign: varchar("mix_design", { length: 100 }).notNull(), // e.g., "C35/45 SCC"
  supplier: text("supplier").notNull(),
  volumeM3: decimal("volume_m3", { precision: 10, scale: 2 }).notNull(),
  slumpMm: integer("slump_mm"), // slump test result in mm
  deliveryTicketNumber: varchar("delivery_ticket_number", { length: 100 }),
  cylinderBatchId: varchar("cylinder_batch_id", { length: 100 }),
  
  qcResult: varchar("qc_result", { length: 20 }).notNull().default("pending"), // pass, fail, pending
  qcNotes: text("qc_notes"),
  pourDate: timestamp("pour_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================================================================
// BOQ ITEMS - Bill of Quantities / Financial Control
// ======================================================================
export const boqItems = pgTable("boq_items", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  
  wbsCode: varchar("wbs_code", { length: 50 }).notNull(), // e.g., "1.2.3"
  category: varchar("category", { length: 100 }).notNull(), // Substructure, Superstructure, MEP, Solar/BIPV
  description: text("description").notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // m³, m², pcs, kg, etc.
  
  contractQty: decimal("contract_qty", { precision: 15, scale: 2 }).notNull(),
  claimedQty: decimal("claimed_qty", { precision: 15, scale: 2 }).default("0"),
  unitRate: decimal("unit_rate", { precision: 10, scale: 2 }).notNull(),
  
  // Auto-calculated fields (can be computed on query, but stored for performance)
  contractBudget: decimal("contract_budget", { precision: 15, scale: 2 }).notNull(), // contractQty * unitRate
  actualSpent: decimal("actual_spent", { precision: 15, scale: 2 }).default("0"),
  variance: decimal("variance", { precision: 15, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================================================================
// RFIs - Requests for Information
// ======================================================================
export const rfis = pgTable("rfis", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  
  rfiNumber: varchar("rfi_number", { length: 50 }).notNull(), // e.g., "RFI-2024-001"
  subject: text("subject").notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // high, medium, low
  
  assignedTo: text("assigned_to"),
  status: varchar("status", { length: 50 }).notNull().default("open"), // open, in-review, closed
  targetDate: date("target_date"),
  closedDate: date("closed_date"),
  
  response: text("response"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================================================================
// MATERIAL DELIVERIES - Delivery tracking & QC
// ======================================================================
export const materialDeliveries = pgTable("material_deliveries", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  
  ticketNumber: varchar("ticket_number", { length: 100 }).notNull(),
  materialDescription: text("material_description").notNull(),
  supplier: text("supplier").notNull(),
  qtyReceived: decimal("qty_received", { precision: 15, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }), // pcs, kg, m³, etc.
  
  qcStatus: varchar("qc_status", { length: 50 }).default("pending"), // approved, rejected, pending
  storageLocation: text("storage_location"), // e.g., "Grid A3-B4"
  deliveryDate: date("delivery_date").notNull(),
  
  inspectionNotes: text("inspection_notes"),
  receivedBy: text("received_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================================================================
// PROGRESS PHOTOS - Geotagged site photos
// ======================================================================
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  reportId: integer("report_id")
    .references(() => dailySiteReports.id, { onDelete: "set null" }),
  
  photoUrl: text("photo_url").notNull(), // Original photo URL
  annotatedUrl: text("annotated_url"), // Markup/annotated version URL
  
  gridLocation: varchar("grid_location", { length: 50 }), // e.g., "Grid C3-D4"
  tradeTag: varchar("trade_tag", { length: 100 }), // e.g., "Foundation Pour", "Facade Mounting"
  
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  caption: text("caption"),
  uploadedBy: text("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// ======================================================================
// PROJECT DOCUMENTS - Document vault with version control
// ======================================================================
export const projectDocuments = pgTable("project_documents", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  
  title: text("title").notNull(),
  category: varchar("category", { length: 100 }), // blueprints, permits, certificates, contracts
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 50 }), // pdf, dwg, xlsx, etc.
  fileSize: integer("file_size"), // bytes
  
  versionTag: varchar("version_tag", { length: 50 }), // e.g., "Rev A", "Rev B"
  status: varchar("status", { length: 50 }).default("approved"), // approved, pending, superseded
  
  uploadedBy: text("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// ======================================================================
// SITE FIELD NOTES - Text and voice memos
// ======================================================================
export const siteFieldNotes = pgTable("site_field_notes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  
  authorName: text("author_name").notNull(),
  noteType: varchar("note_type", { length: 50 }).default("general"), // general, defect, observation, instruction
  content: text("content").notNull(),
  
  voiceMemoUrl: text("voice_memo_url"), // URL to voice recording
  
  // Blueprint pin coordinates (normalized 0-1)
  pinX: real("pin_x"),
  pinY: real("pin_y"),
  blueprintId: integer("blueprint_id"), // Reference to a document ID if pinned to blueprint
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================================================================
// RELATIONS
// ======================================================================
export const projectsRelations = relations(projects, ({ many }) => ({
  dailyReports: many(dailySiteReports),
  concretePours: many(concretePours),
  boqItems: many(boqItems),
  rfis: many(rfis),
  deliveries: many(materialDeliveries),
  photos: many(progressPhotos),
  documents: many(projectDocuments),
  fieldNotes: many(siteFieldNotes),
}));

export const dailySiteReportsRelations = relations(dailySiteReports, ({ one, many }) => ({
  project: one(projects, {
    fields: [dailySiteReports.projectId],
    references: [projects.id],
  }),
  concretePours: many(concretePours),
  photos: many(progressPhotos),
}));

export const concretePoursRelations = relations(concretePours, ({ one }) => ({
  report: one(dailySiteReports, {
    fields: [concretePours.reportId],
    references: [dailySiteReports.id],
  }),
  project: one(projects, {
    fields: [concretePours.projectId],
    references: [projects.id],
  }),
}));

export const boqItemsRelations = relations(boqItems, ({ one }) => ({
  project: one(projects, {
    fields: [boqItems.projectId],
    references: [projects.id],
  }),
}));

export const rfisRelations = relations(rfis, ({ one }) => ({
  project: one(projects, {
    fields: [rfis.projectId],
    references: [projects.id],
  }),
}));

export const materialDeliveriesRelations = relations(materialDeliveries, ({ one }) => ({
  project: one(projects, {
    fields: [materialDeliveries.projectId],
    references: [projects.id],
  }),
}));

export const progressPhotosRelations = relations(progressPhotos, ({ one }) => ({
  project: one(projects, {
    fields: [progressPhotos.projectId],
    references: [projects.id],
  }),
  report: one(dailySiteReports, {
    fields: [progressPhotos.reportId],
    references: [dailySiteReports.id],
  }),
}));

export const projectDocumentsRelations = relations(projectDocuments, ({ one }) => ({
  project: one(projects, {
    fields: [projectDocuments.projectId],
    references: [projects.id],
  }),
}));

export const siteFieldNotesRelations = relations(siteFieldNotes, ({ one }) => ({
  project: one(projects, {
    fields: [siteFieldNotes.projectId],
    references: [projects.id],
  }),
}));

// Auth relations
export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  projects: many(projects),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  projects: many(projects),
  subscriptionEvents: many(subscriptionEvents),
}));

export const subscriptionEventsRelations = relations(subscriptionEvents, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptionEvents.organizationId],
    references: [organizations.id],
  }),
}));
