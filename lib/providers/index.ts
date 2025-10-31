// Provider interface and factory for AI chat streaming

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatProvider {
  /** Stream chat completions as an async iterable of token strings */
  streamChat: (args: {
    messages: ChatMessage[];
    model?: string;
  }) => AsyncIterable<string>;
  
  /** Count tokens (optional, for usage tracking) */
  countTokens?: (text: string) => Promise<{ prompt: number; completion: number }>;
  
  /** Provider name */
  name: "github" | "openai";
}

export interface ProviderConfig {
  provider?: "github" | "openai";
  githubToken?: string;
  openaiApiKey?: string;
}

/**
 * Get AI provider instance based on environment configuration
 */
export async function getProvider(config: ProviderConfig): Promise<ChatProvider> {
  const provider = config.provider || "github";
  
  if (provider === "openai") {
    const { createOpenAIProvider } = await import("./openai");
    if (!config.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is required for OpenAI provider");
    }
    return createOpenAIProvider(config.openaiApiKey);
  }
  
  // Default to GitHub Models
  const { createGitHubProvider } = await import("./github-models");
  if (!config.githubToken) {
    throw new Error("GITHUB_TOKEN is required for GitHub Models provider");
  }
  return createGitHubProvider(config.githubToken);
}
