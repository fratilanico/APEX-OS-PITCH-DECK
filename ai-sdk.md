        Analyze
      </Button>

      {/* Renders progressively as data streams in */}
      {object && (
        <div>
          <Badge>{object.category}</Badge>
          <Badge>{object.mood}</Badge>
          
          {/* Arrays stream item by item */}
          <div className="flex gap-2">
            {object.themes?.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
          
          {/* Strings stream character by character */}
          <p>{object.insight}</p>
          
          <ul>
            {object.relatedQuestions?.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Key points:**
- Schema must be defined on both client and server
- Arrays stream item by item (each item appears as it's generated)
- Strings stream character by character
- Use optional chaining (`object?.field`) since object builds up progressively


---

## v6 Migration


| v5 | v6 |
|----|-----|
| `tool({ parameters })` | `tool({ inputSchema })` |
| Tool `result` property | Tool `output` property |
| States: `partial-call`, `call`, `result` | States: `input-streaming`, `input-available`, `output-available` |
| `maxToolRoundtrips` | `stopWhen: stepCountIs(n)` |
| `result.toAIStream()` | `result.toUIMessageStream()` |
| `pipeDataStreamToResponse()` | `pipeUIMessageStreamToResponse()` |

---

## Patched Fetch

Forge API returns `"type": ""` in streaming tool_calls. AI SDK expects no `type` field:

```ts
// server/_core/patchedFetch.ts
export function createPatchedFetch(): typeof fetch {
  return async (input, init) => {
    const response = await fetch(input, init);
    if (!response.body) return response;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/event-stream")) return response;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) { controller.close(); return; }

        let text = decoder.decode(value, { stream: true });
        text = text.replace(/"type"\s*:\s*(""|null)\s*,?\s*/g, "");
        controller.enqueue(encoder.encode(text));
      },
    });

    return new Response(stream, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}
```

---

## Import Reference

```ts
// From 'ai'
import {
  streamText, generateText, generateObject,
  convertToModelMessages, createUIMessageStream,
  pipeUIMessageStreamToResponse, generateId,
  stepCountIs, tool, UIMessage,
} from "ai";