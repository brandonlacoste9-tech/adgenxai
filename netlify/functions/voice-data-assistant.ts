import { Handler } from '@netlify/functions';
import { RealtimeAgent } from '@openai/agents/realtime';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const agent = new RealtimeAgent({
      name: 'Codex Data Analyst',
      instructions: `You are a voice-enabled data analyst for the Codex Hivemind.\n\nYou can:\n1. Query the database using natural language\n2. Analyze trends and anomalies\n3. Generate reports\n4. Answer business questions\n5. Trigger actions based on data insights\n\nExample commands:\n- "What were our API error rates yesterday?"\n- "Show me the slowest endpoints this week"\n- "Alert me if deployment success rate drops below 95%"\n- "Generate a weekly performance report"\n\nAlways explain what you're doing in plain English.`,
      tools: [
        {
          type: 'function',
          function: {
            name: 'query_database',
            description: 'Query the Snowflake database',
            parameters: {
              type: 'object',
              properties: {
                question: {
                  type: 'string',
                  description: 'The question to answer with data'
                }
              },
              required: ['question']
            }
          }
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Voice + Data agent initialized',
        status: 'Ready for realtime session binding',
        jobId: `voice-data-${Date.now()}`,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Failed to initialise voice data assistant', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create voice data agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
