declare module '@openai/agents/realtime' {
  interface RealtimeAgentOptions {
    name: string;
    instructions: string;
    tools?: Array<{
      type: string;
      function: {
        name: string;
        description?: string;
        parameters?: Record<string, unknown>;
      };
    }>;
  }

  interface RealtimeSessionConnectionOptions {
    apiKey: string;
  }

  export class RealtimeAgent {
    constructor(options: RealtimeAgentOptions);
  }

  export class RealtimeSession {
    readonly id: string;
    constructor(agent: RealtimeAgent);
    connect(options: RealtimeSessionConnectionOptions): Promise<void>;
  }
}
