import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chats, messages, userProgress, savedTemplates } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Update user track selection
export async function updateUserTrack(userId: number, track: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ selectedTrack: track, onboardingComplete: true }).where(eq(users.id, userId));
}

// Chat operations
export async function createChat(chatId: string, userId: number, title: string, track?: string, moduleId?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(chats).values({ chatId, userId, title, track: track || null, moduleId: moduleId || null });
}

export async function getUserChats(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.updatedAt));
}

export async function getChatById(chatId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chats).where(eq(chats.chatId, chatId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateChatTitle(chatId: string, title: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(chats).set({ title }).where(eq(chats.chatId, chatId));
}

export async function deleteChat(chatId: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(messages).where(eq(messages.chatId, chatId));
  await db.delete(chats).where(eq(chats.chatId, chatId));
}

// Message operations
export async function saveMessages(chatId: string, msgs: Array<{ id: string; content: any; ordering: number }>) {
  const db = await getDb();
  if (!db) return;
  if (msgs.length === 0) return;
  await db.delete(messages).where(eq(messages.chatId, chatId));
  const values = msgs.map(m => ({ id: m.id, chatId, content: m.content, ordering: m.ordering }));
  for (let i = 0; i < values.length; i += 50) {
    await db.insert(messages).values(values.slice(i, i + 50));
  }
}

export async function getChatMessages(chatId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(asc(messages.ordering));
}

// Progress operations
export async function markExerciseComplete(userId: number, track: string, moduleId: string, exerciseId: string, score?: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.exerciseId, exerciseId)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(userProgress)
      .set({ completed: true, score: score || null, completedAt: new Date() })
      .where(eq(userProgress.id, existing[0].id));
  } else {
    await db.insert(userProgress).values({
      userId, track, moduleId, exerciseId, completed: true, score: score || null, completedAt: new Date(),
    });
  }
}

export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function getUserProgressByTrack(userId: number, track: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.track, track)));
}

// Saved templates
export async function saveTemplate(userId: number, templateId: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(savedTemplates)
    .where(and(eq(savedTemplates.userId, userId), eq(savedTemplates.templateId, templateId)))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(savedTemplates).values({ userId, templateId });
  }
}

export async function unsaveTemplate(userId: number, templateId: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(savedTemplates)
    .where(and(eq(savedTemplates.userId, userId), eq(savedTemplates.templateId, templateId)));
}

export async function getUserSavedTemplates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedTemplates).where(eq(savedTemplates.userId, userId));
}
