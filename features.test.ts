import { describe, expect, it } from "vitest";
import { TRACKS, PROMPT_TEMPLATES, getTrack, getModule, getExercise, getTemplatesForTrack } from "../shared/tracks";

describe("Tracks data integrity", () => {
  it("should have exactly 5 tracks", () => {
    expect(TRACKS).toHaveLength(5);
  });

  it("should have correct track IDs", () => {
    const ids = TRACKS.map(t => t.id);
    expect(ids).toContain("sales");
    expect(ids).toContain("engineering");
    expect(ids).toContain("marketing");
    expect(ids).toContain("founders");
    expect(ids).toContain("productivity");
  });

  it("each track should have 7 modules", () => {
    for (const track of TRACKS) {
      expect(track.modules).toHaveLength(7);
    }
  });

  it("each module should have 3 exercises", () => {
    for (const track of TRACKS) {
      for (const mod of track.modules) {
        expect(mod.exercises).toHaveLength(3);
      }
    }
  });

  it("total exercises should be 105", () => {
    const total = TRACKS.reduce(
      (sum, t) => sum + t.modules.reduce((s, m) => s + m.exercises.length, 0),
      0
    );
    expect(total).toBe(105);
  });

  it("each track should have required fields", () => {
    for (const track of TRACKS) {
      expect(track.id).toBeTruthy();
      expect(track.name).toBeTruthy();
      expect(track.description).toBeTruthy();
      expect(track.icon).toBeTruthy();
      expect(track.color).toBeTruthy();
    }
  });

  it("each exercise should have a system prompt", () => {
    for (const track of TRACKS) {
      for (const mod of track.modules) {
        for (const ex of mod.exercises) {
          expect(ex.systemPrompt).toBeTruthy();
          expect(ex.systemPrompt.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it("each exercise should have a valid difficulty", () => {
    const validDifficulties = ["beginner", "intermediate", "advanced"];
    for (const track of TRACKS) {
      for (const mod of track.modules) {
        for (const ex of mod.exercises) {
          expect(validDifficulties).toContain(ex.difficulty);
        }
      }
    }
  });

  it("each exercise should have a valid type", () => {
    const validTypes = ["prompt-craft", "chat-practice", "analysis", "template-use"];
    for (const track of TRACKS) {
      for (const mod of track.modules) {
        for (const ex of mod.exercises) {
          expect(validTypes).toContain(ex.type);
        }
      }
    }
  });

  it("modules should have correct ordering", () => {
    for (const track of TRACKS) {
      for (let i = 0; i < track.modules.length; i++) {
        expect(track.modules[i].order).toBe(i + 1);
      }
    }
  });
});

describe("Track lookup functions", () => {
  it("getTrack should return correct track", () => {
    const sales = getTrack("sales");
    expect(sales).toBeTruthy();
    expect(sales!.name).toBe("Sales");
    expect(sales!.modules).toHaveLength(7);
  });

  it("getTrack should return undefined for invalid ID", () => {
    const result = getTrack("nonexistent");
    expect(result).toBeUndefined();
  });

  it("getModule should return correct module", () => {
    const mod = getModule("sales", "sales-1");
    expect(mod).toBeTruthy();
    expect(mod!.title).toBe("AI-Powered Prospecting");
    expect(mod!.exercises).toHaveLength(3);
  });

  it("getModule should return undefined for invalid IDs", () => {
    expect(getModule("sales", "nonexistent")).toBeUndefined();
    expect(getModule("nonexistent", "sales-1")).toBeUndefined();
  });

  it("getExercise should return correct exercise", () => {
    const ex = getExercise("sales", "sales-1", "s1e1");
    expect(ex).toBeTruthy();
    expect(ex!.title).toBe("Build an Ideal Customer Profile");
    expect(ex!.difficulty).toBe("beginner");
    expect(ex!.type).toBe("prompt-craft");
  });

  it("getExercise should return undefined for invalid IDs", () => {
    expect(getExercise("sales", "sales-1", "nonexistent")).toBeUndefined();
    expect(getExercise("sales", "nonexistent", "s1e1")).toBeUndefined();
    expect(getExercise("nonexistent", "sales-1", "s1e1")).toBeUndefined();
  });
});

describe("Prompt Templates", () => {
  it("should have at least 30 templates", () => {
    expect(PROMPT_TEMPLATES.length).toBeGreaterThanOrEqual(30);
  });

  it("each template should have required fields", () => {
    for (const tmpl of PROMPT_TEMPLATES) {
      expect(tmpl.id).toBeTruthy();
      expect(tmpl.trackId).toBeTruthy();
      expect(tmpl.title).toBeTruthy();
      expect(tmpl.description).toBeTruthy();
      expect(tmpl.category).toBeTruthy();
      expect(tmpl.template).toBeTruthy();
      expect(Array.isArray(tmpl.variables)).toBe(true);
    }
  });

  it("templates should reference valid tracks", () => {
    const trackIds = TRACKS.map(t => t.id);
    for (const tmpl of PROMPT_TEMPLATES) {
      expect(trackIds).toContain(tmpl.trackId);
    }
  });

  it("getTemplatesForTrack should filter correctly", () => {
    const salesTemplates = getTemplatesForTrack("sales");
    expect(salesTemplates.length).toBeGreaterThan(0);
    for (const tmpl of salesTemplates) {
      expect(tmpl.trackId).toBe("sales");
    }
  });

  it("each track should have templates", () => {
    for (const track of TRACKS) {
      const templates = getTemplatesForTrack(track.id);
      expect(templates.length).toBeGreaterThan(0);
    }
  });

  it("templates should have variables as arrays", () => {
    for (const tmpl of PROMPT_TEMPLATES) {
      expect(Array.isArray(tmpl.variables)).toBe(true);
      for (const v of tmpl.variables) {
        expect(typeof v).toBe("string");
      }
    }
  });
});

describe("Router structure validation", () => {
  it("appRouter should export correctly", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
  });

  it("appRouter should have required routers", async () => {
    const { appRouter } = await import("./routers");
    // Check that the router has the expected procedures
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain("auth.me");
    expect(procedures).toContain("auth.logout");
    expect(procedures).toContain("tracks.list");
    expect(procedures).toContain("tracks.get");
    expect(procedures).toContain("tracks.getModule");
    expect(procedures).toContain("tracks.getExercise");
    expect(procedures).toContain("chat.list");
    expect(procedures).toContain("chat.create");
    expect(procedures).toContain("chat.delete");
    expect(procedures).toContain("progress.getAll");
    expect(procedures).toContain("progress.markComplete");
    expect(procedures).toContain("templates.list");
    expect(procedures).toContain("templates.save");
    expect(procedures).toContain("templates.unsave");
  });
});
