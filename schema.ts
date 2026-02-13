import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  selectedTrack: varchar("selectedTrack", { length: 64 }),
  onboardingComplete: boolean("onboardingComplete").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const chats = mysqlTable("chats", {
  id: int("id").autoincrement().primaryKey(),
  chatId: varchar("chatId", { length: 64 }).notNull().unique(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 256 }).default("New Chat").notNull(),
  track: varchar("track", { length: 64 }),
  moduleId: varchar("moduleId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  chatId: varchar("chatId", { length: 64 }).notNull(),
  content: json("content").notNull(),
  ordering: int("ordering").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  track: varchar("track", { length: 64 }).notNull(),
  moduleId: varchar("moduleId", { length: 64 }).notNull(),
  exerciseId: varchar("exerciseId", { length: 64 }),
  completed: boolean("completed").default(false).notNull(),
  score: int("score"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const savedTemplates = mysqlTable("saved_templates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  templateId: varchar("templateId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type SavedTemplate = typeof savedTemplates.$inferSelect;
