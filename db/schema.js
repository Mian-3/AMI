import { pgTable, serial, text, timestamp, jsonb, integer, varchar } from "drizzle-orm/pg-core";

const now = (name) => timestamp(name, { withTimezone: true }).notNull().defaultNow();

// People who can log in to /admin
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  createdAt: now("created_at"),
});

// Page sections: one row per section, e.g. "home.stats", "about.hero"
// value = { en: {...}, ar: {...} }
export const siteContent = pgTable("site_content", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: now("updated_at"),
});

// Insights articles
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  imageUrl: text("image_url").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  data: jsonb("data").notNull().default({}), // { en: {title, excerpt, tag, readTime, body}, ar: {...} }
  createdAt: now("created_at"),
  updatedAt: now("updated_at"),
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  imageUrl: text("image_url").notNull().default(""),
  eventDate: timestamp("event_date", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  data: jsonb("data").notNull().default({}), // { en: {title, venue}, ar: {...} }
  createdAt: now("created_at"),
  updatedAt: now("updated_at"),
});

// Contact form enquiries
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  company: varchar("company", { length: 160 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  topic: varchar("topic", { length: 60 }).notNull().default(""),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: now("created_at"),
});