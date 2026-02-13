/**
 * Chat API Handler with role-specific system prompts
 */

import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  generateId,
  stepCountIs,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Express } from "express";
import { ENV } from "./env";
import { createPatchedFetch } from "./patchedFetch";
import { getExercise } from "../../shared/tracks";

function createLLMProvider() {
  const baseURL = ENV.forgeApiUrl.endsWith("/v1")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/v1`;

  return createOpenAI({
    baseURL,
    apiKey: ENV.forgeApiKey,
    fetch: createPatchedFetch(fetch),
  });
}

const BASE_SYSTEM_PROMPT = `You are AI App Buddy Pro, an expert AI training assistant that helps professionals master AI tools and techniques.

## Response Formatting Rules:
- Always use proper Markdown formatting with headers (##, ###), bold, italic, lists, and code blocks
- Use code blocks with language identifiers for any code: \`\`\`python, \`\`\`javascript, etc.
- Use tables when comparing options or presenting structured data
- Use blockquotes for key insights or important notes
- Use numbered lists for step-by-step instructions
- Use bullet points for feature lists or options
- Include ASCII art diagrams when explaining architectures or flows
- Bold key terms and concepts
- Use horizontal rules (---) to separate major sections
- Keep responses well-structured with clear hierarchy

## ASCII Art Examples:
When explaining system architectures, use diagrams like:
\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend   │────▶│   API Layer  │────▶│   Database   │
│   (React)    │◀────│   (Express)  │◀────│   (MySQL)    │
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`

## Personality:
- Professional but approachable
- Encouraging and supportive
- Practical and actionable
- Use real-world examples
- Acknowledge the user's progress`;

function getSystemPromptForContext(track?: string, moduleId?: string, exerciseId?: string): string {
  if (track && moduleId && exerciseId) {
    const exercise = getExercise(track, moduleId, exerciseId);
    if (exercise) {
      return `${BASE_SYSTEM_PROMPT}\n\n## Current Exercise Context:\nTrack: ${track}\nModule: ${moduleId}\nExercise: ${exercise.title}\n\n## Exercise-Specific Instructions:\n${exercise.systemPrompt}`;
    }
  }
  return BASE_SYSTEM_PROMPT;
}

export function registerChatRoutes(app: Express) {
  const openai = createLLMProvider();

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatId, track, moduleId, exerciseId } = req.body;

      if (!message) {
        res.status(400).json({ error: "message is required" });
        return;
      }

      const systemPrompt = getSystemPromptForContext(track, moduleId, exerciseId);

      // Get previous messages from the request body
      const previousMessages = req.body.messages || [message];

      const modelMessages = await convertToModelMessages(previousMessages);

      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          writer.write({ type: "start", messageId: generateId() });

          const result = streamText({
            model: openai.chat("gpt-4o"),
            system: systemPrompt,
            messages: modelMessages,
            stopWhen: stepCountIs(5),
          });

          result.consumeStream();
          writer.merge(result.toUIMessageStream({ sendStart: false }));
        },
      });

      pipeUIMessageStreamToResponse({ response: res, stream });
    } catch (error) {
      console.error("[/api/chat] Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });
}
