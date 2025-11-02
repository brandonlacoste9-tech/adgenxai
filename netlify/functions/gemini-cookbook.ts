import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { path } = event.queryStringParameters || {};
    
    // Route to different cookbook endpoints
    switch (path) {
      case 'health':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: 'healthy',
            message: 'AdgenxAI Gemini Cookbook API is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
          })
        };
        
      case 'dashboard':
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'text/html'
          },
          body: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AdgenxAI Gemini Cookbook - Dashboard</title>
    <style>
        body { 
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            color: #ffffff;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 3rem; font-weight: 700; margin-bottom: 10px; }
        .subtitle { font-size: 1.2rem; opacity: 0.8; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 24px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); }
        .card-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 12px; }
        .card-desc { opacity: 0.8; line-height: 1.6; }
        .status { color: #4ade80; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🧠 AdgenxAI Gemini Cookbook</h1>
            <p class="subtitle">Neuromorphic AI Development Platform</p>
            <p class="status">✅ Deployed on Netlify - API Keys Configured</p>
        </div>
        
        <div class="cards">
            <div class="card">
                <h3 class="card-title">🚀 Interactive Launcher</h3>
                <p class="card-desc">Launch the Python cookbook locally with the interactive menu system for full voice and streaming capabilities.</p>
            </div>
            
            <div class="card">
                <h3 class="card-title">🌐 Voice Dashboard</h3>
                <p class="card-desc">Real-time streaming responses with speech-to-text input and audio output for immersive AI interaction.</p>
            </div>
            
            <div class="card">
                <h3 class="card-title">🧠 BeeHive Codex</h3>
                <p class="card-desc">Neuromorphic AI patterns with four-ritual system integration for Agent-First development.</p>
            </div>
            
            <div class="card">
                <h3 class="card-title">📊 Session Analytics</h3>
                <p class="card-desc">Comprehensive logging with JSON export, performance metrics, and searchable session history.</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; opacity: 0.6;">
            <p>🌟 Ready to revolutionize AI development with neuromorphic patterns! 🌟</p>
        </div>
    </div>
</body>
</html>`
        };
        
      default:
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'AdgenxAI Gemini Cookbook API',
            version: '1.0.0',
            endpoints: [
              '?path=health - Health check',
              '?path=dashboard - Interactive dashboard',
            ],
            cookbook: {
              status: 'ready',
              features: [
                'Voice-enabled interaction',
                'Real-time streaming',
                'BeeHive Codex integration',
                'Session logging & analytics',
                'VS Code integration'
              ]
            }
          })
        };
    }
  } catch (error) {
    console.error('Gemini Cookbook API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};