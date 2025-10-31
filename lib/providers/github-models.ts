// GitHub Models provider implementation with streaming support
import type { ChatProvider, ChatMessage } from "./index";

/**
 * Create a GitHub Models provider instance
 */
export function createGitHubProvider(token: string): ChatProvider {
  return {
    name: "github",
    
    async *streamChat({ messages, model = "gpt-4o-mini" }) {
      const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages,
          model,
          stream: true,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub Models API error: ${response.status} ${error}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                yield delta;
              }
            } catch (e) {
              // Skip invalid JSON lines
              console.warn("Failed to parse SSE line:", trimmed, e);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },

    async countTokens(text: string) {
      // Rough estimation: ~4 characters per token for English text
      const tokenCount = Math.ceil(text.length / 4);
      return { prompt: tokenCount, completion: 0 };
    },
  };
}
