import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod/v4";
import * as db from "./db";
import { TRACKS, PROMPT_TEMPLATES, getTrack, getModule, getExercise, getTemplatesForTrack } from "../shared/tracks";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  user: router({
    updateTrack: protectedProcedure
      .input(z.object({ track: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserTrack(ctx.user.id, input.track);
        return { success: true };
      }),
  }),

  tracks: router({
    list: publicProcedure.query(() => {
      return TRACKS.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        icon: t.icon,
        color: t.color,
        moduleCount: t.modules.length,
        exerciseCount: t.modules.reduce((sum, m) => sum + m.exercises.length, 0),
      }));
    }),
    get: publicProcedure
      .input(z.object({ trackId: z.string() }))
      .query(({ input }) => {
        const track = getTrack(input.trackId);
        if (!track) return null;
        return track;
      }),
    getModule: publicProcedure
      .input(z.object({ trackId: z.string(), moduleId: z.string() }))
      .query(({ input }) => {
        const mod = getModule(input.trackId, input.moduleId);
        if (!mod) return null;
        return mod;
      }),
    getExercise: publicProcedure
      .input(z.object({ trackId: z.string(), moduleId: z.string(), exerciseId: z.string() }))
      .query(({ input }) => {
        const exercise = getExercise(input.trackId, input.moduleId, input.exerciseId);
        if (!exercise) return null;
        return exercise;
      }),
  }),

  chat: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserChats(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        chatId: z.string(),
        title: z.string().optional(),
        track: z.string().optional(),
        moduleId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createChat(input.chatId, ctx.user.id, input.title || "New Chat", input.track, input.moduleId);
        return { success: true };
      }),
    get: protectedProcedure
      .input(z.object({ chatId: z.string() }))
      .query(async ({ input }) => {
        return db.getChatById(input.chatId);
      }),
    updateTitle: protectedProcedure
      .input(z.object({ chatId: z.string(), title: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateChatTitle(input.chatId, input.title);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ chatId: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteChat(input.chatId);
        return { success: true };
      }),
    loadMessages: protectedProcedure
      .input(z.object({ chatId: z.string() }))
      .query(async ({ input }) => {
        const msgs = await db.getChatMessages(input.chatId);
        return msgs.map(m => m.content);
      }),
    saveMessages: protectedProcedure
      .input(z.object({
        chatId: z.string(),
        messages: z.array(z.any()),
      }))
      .mutation(async ({ input }) => {
        const msgs = input.messages.map((m: any, i: number) => ({
          id: m.id || `msg-${i}`,
          content: m,
          ordering: i,
        }));
        await db.saveMessages(input.chatId, msgs);
        return { success: true };
      }),
  }),

  progress: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProgress(ctx.user.id);
    }),
    getByTrack: protectedProcedure
      .input(z.object({ track: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getUserProgressByTrack(ctx.user.id, input.track);
      }),
    markComplete: protectedProcedure
      .input(z.object({
        track: z.string(),
        moduleId: z.string(),
        exerciseId: z.string(),
        score: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.markExerciseComplete(ctx.user.id, input.track, input.moduleId, input.exerciseId, input.score);
        return { success: true };
      }),
  }),

  templates: router({
    list: publicProcedure
      .input(z.object({ trackId: z.string().optional() }).optional())
      .query(({ input }) => {
        if (input?.trackId) {
          return getTemplatesForTrack(input.trackId);
        }
        return PROMPT_TEMPLATES;
      }),
    saved: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSavedTemplates(ctx.user.id);
    }),
    save: protectedProcedure
      .input(z.object({ templateId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.saveTemplate(ctx.user.id, input.templateId);
        return { success: true };
      }),
    unsave: protectedProcedure
      .input(z.object({ templateId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.unsaveTemplate(ctx.user.id, input.templateId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
