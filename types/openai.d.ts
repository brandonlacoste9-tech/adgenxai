declare module 'openai' {
  interface ChatCompletionMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
  }

  interface ChatCompletionChoice {
    message?: Partial<ChatCompletionMessage>;
  }

  interface ChatCompletionResponse {
    choices: ChatCompletionChoice[];
  }

  interface ChatCompletionCreateParams {
    model: string;
    messages: ChatCompletionMessage[];
  }

  export default class OpenAI {
    constructor(config?: { apiKey?: string });
    chat: {
      completions: {
        create(params: ChatCompletionCreateParams): Promise<ChatCompletionResponse>;
      };
    };
  }
}
