import { Handler } from '@netlify/functions';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Missing OPENAI_API_KEY environment variable'
      })
    };
  }

  try {
    const agent = new RealtimeAgent({
      name: 'Codex Voice Assistant',
      instructions: `You are the voice interface for the Codex Hivemind.\n\nYou can execute commands like:\n- "Deploy the latest changes"\n- "Run security audit"\n- "Show me the health dashboard"\n- "Research best practices for authentication"\n- "Create a PR for the bug fix"\n\nAlways confirm actions with the user before executing.`
    });

    const session = new RealtimeSession(agent);

    await session.connect({
      apiKey
    });

    const metadata = {
      sessionId: session.id,
      status: 'Voice agent ready',
      jobId: `voice-agent-${session.id}`,
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      body: JSON.stringify(metadata)
    };
  } catch (error) {
    console.error('Failed to initialise voice command agent', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to initialise voice agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
