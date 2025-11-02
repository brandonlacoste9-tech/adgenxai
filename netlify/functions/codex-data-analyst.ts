import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface AnalystRequestBody {
  question?: string;
  database?: string;
  warehouse?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}') as AnalystRequestBody;
    const { question, database, warehouse } = body;

    if (!question || !database || !warehouse) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['question', 'database', 'warehouse']
        })
      };
    }

    const schemaQuery = `SELECT column_name, table_name, data_type, comment FROM ${database}.INFORMATION_SCHEMA.COLUMNS`;
    const schemaResult = await querySnowflake(schemaQuery, warehouse);

    const sqlResponse = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are an expert SQL analyst. Here's the schema:\n${JSON.stringify(schemaResult)}`
        },
        {
          role: 'user',
          content: `Write a SQL query to answer: ${question}`
        }
      ]
    });

    const sqlMessage = sqlResponse.choices[0]?.message?.content ?? '';
    const sqlQuery = extractSQL(sqlMessage);

    const results = await querySnowflake(sqlQuery, warehouse);

    const explanationResponse = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: 'Explain these query results in plain English'
        },
        {
          role: 'user',
          content: JSON.stringify(results)
        }
      ]
    });

    const metadata = {
      question,
      sql: sqlQuery,
      results,
      explanation: explanationResponse.choices[0]?.message?.content ?? 'No explanation returned',
      jobId: `data-analyst-${Date.now()}`,
      status: 'Analysis complete',
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      body: JSON.stringify(metadata)
    };
  } catch (error) {
    console.error('Failed to execute Codex data analyst workflow', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Data analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function querySnowflake(query: string, warehouse: string) {
  const account = process.env.SNOWFLAKE_ACCOUNT;
  const token = process.env.SNOWFLAKE_TOKEN;
  const role = process.env.SNOWFLAKE_ROLE;

  if (!account || !token || !role) {
    throw new Error('Missing Snowflake credentials');
  }

  const response = await fetch(
    `https://${account}.snowflakecomputing.com/api/v2/statements`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        statement: query,
        warehouse,
        role
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Snowflake query failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}

function extractSQL(text: string): string {
  const codeFenceMatch = text.match(/```sql\n([\s\S]*?)```/i);

  if (codeFenceMatch && codeFenceMatch[1]) {
    return codeFenceMatch[1].trim();
  }

  return text.trim();
}
