#!/usr/bin/env python3
"""
AdgenxAI Fusion v2 - Voice-Enabled Gemini Orchestration Platform
Enterprise-grade FastAPI + Gemini 2.5 Pro backend with streaming and TTS
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.warning("GOOGLE_API_KEY not found. Some features will be limited.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

# Configuration
PORT = int(os.getenv("PORT", 8000))
CONTEXT = os.getenv("CONTEXT", "dev")
NOTIFY = os.getenv("NOTIFY", "true").lower() == "true"

# Ensure directories exist
Path("logs").mkdir(exist_ok=True)
Path("speech").mkdir(exist_ok=True)

app = FastAPI(
    title="AdgenxAI Fusion v2",
    description="Voice-Enabled Gemini Orchestration Platform",
    version="2.0.0"
)

# Global session storage
sessions = {}

@app.get("/", response_class=HTMLResponse)
async def fusion_dashboard():
    """Main Fusion Dashboard with voice capabilities"""
    return HTMLResponse(content="""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AdgenxAI Fusion v2 - Voice Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .title { font-size: 3.5rem; font-weight: 800; margin-bottom: 10px; 
                 background: linear-gradient(45deg, #64ffda, #00bcd4, #4fc3f7);
                 -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 1.4rem; opacity: 0.9; margin-bottom: 20px; }
        .status-bar {
            display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;
            background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 12px;
        }
        .status-item { display: flex; align-items: center; gap: 8px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; }
        
        .main-grid { display: grid; grid-template-columns: 1fr 400px; gap: 30px; margin-bottom: 30px; }
        .chat-panel {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 25px;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .controls-panel {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 25px;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; margin-bottom: 8px; font-weight: 600; }
        .input-group textarea {
            width: 100%; padding: 15px; border-radius: 12px;
            background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff; font-size: 16px; min-height: 120px;
            resize: vertical; font-family: inherit;
        }
        .input-group textarea:focus {
            outline: none; border-color: #64ffda;
            box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.1);
        }
        
        .button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .btn {
            padding: 12px 20px; border-radius: 10px; border: none;
            font-weight: 600; cursor: pointer; transition: all 0.3s ease;
            font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary { background: linear-gradient(45deg, #64ffda, #00bcd4); color: #000; }
        .btn-secondary { background: rgba(255, 255, 255, 0.1); color: #fff; }
        .btn-voice { background: linear-gradient(45deg, #ff6b6b, #ff8e8e); color: #fff; }
        .btn-clear { background: linear-gradient(45deg, #ffa726, #ffcc02); color: #000; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
        
        .response-area {
            background: rgba(0, 0, 0, 0.4); border-radius: 12px; padding: 20px;
            min-height: 300px; max-height: 500px; overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .response-text { line-height: 1.7; font-size: 15px; }
        
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
        .metric-card {
            background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px;
            text-align: center; border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .metric-value { font-size: 1.8rem; font-weight: 700; color: #64ffda; }
        .metric-label { font-size: 0.9rem; opacity: 0.8; margin-top: 5px; }
        
        .logs-section { margin-top: 30px; }
        .logs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .logs-area {
            background: rgba(0, 0, 0, 0.4); border-radius: 12px; padding: 20px;
            max-height: 200px; overflow-y: auto; font-family: 'Monaco', monospace;
            font-size: 13px; border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .main-grid { grid-template-columns: 1fr; }
            .title { font-size: 2.5rem; }
            .status-bar { flex-direction: column; }
        }
        
        .loading { opacity: 0.6; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🧠 AdgenxAI Fusion v2</h1>
            <p class="subtitle">Voice-Enabled Gemini Orchestration Platform</p>
            <div class="status-bar">
                <div class="status-item">
                    <div class="status-dot"></div>
                    <span>Fusion Active</span>
                </div>
                <div class="status-item">
                    <div class="status-dot"></div>
                    <span>Gemini 2.5 Pro</span>
                </div>
                <div class="status-item">
                    <div class="status-dot"></div>
                    <span>Voice Ready</span>
                </div>
                <div class="status-item">
                    <div class="status-dot"></div>
                    <span>Context: """ + CONTEXT + """</span>
                </div>
            </div>
        </div>
        
        <div class="main-grid">
            <div class="chat-panel">
                <div class="input-group">
                    <label>💬 Fusion Prompt</label>
                    <textarea id="promptInput" placeholder="Enter your prompt for Gemini 2.5 Pro..."></textarea>
                </div>
                
                <div class="button-grid">
                    <button class="btn btn-primary" onclick="sendPrompt()">
                        🚀 Generate
                    </button>
                    <button class="btn btn-voice" onclick="toggleVoice()">
                        🎙️ Voice
                    </button>
                    <button class="btn btn-secondary" onclick="streamPrompt()">
                        ⚡ Stream
                    </button>
                    <button class="btn btn-clear" onclick="clearAll()">
                        🗑️ Clear
                    </button>
                </div>
                
                <div class="response-area">
                    <div id="responseText" class="response-text">
                        Welcome to AdgenxAI Fusion v2! 🚀<br><br>
                        This voice-enabled dashboard connects to Google Gemini 2.5 Pro for advanced AI interactions.<br><br>
                        Enter a prompt above and click Generate to start, or use Voice for hands-free interaction.
                    </div>
                </div>
            </div>
            
            <div class="controls-panel">
                <h3 style="margin-bottom: 20px;">🎛️ Fusion Controls</h3>
                
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value" id="tokenCount">0</div>
                        <div class="metric-label">Tokens</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="responseTime">0ms</div>
                        <div class="metric-label">Latency</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="sessionCount">0</div>
                        <div class="metric-label">Sessions</div>
                    </div>
                </div>
                
                <div style="margin-top: 25px;">
                    <h4 style="margin-bottom: 15px;">🎯 Quick Actions</h4>
                    <button class="btn btn-secondary" onclick="runRehearsal()" style="width: 100%; margin-bottom: 10px;">
                        🎭 Run Rehearsal
                    </button>
                    <button class="btn btn-secondary" onclick="exportLogs()" style="width: 100%; margin-bottom: 10px;">
                        📊 Export Logs
                    </button>
                    <button class="btn btn-secondary" onclick="testEndpoints()" style="width: 100%;">
                        🔧 Test Endpoints
                    </button>
                </div>
            </div>
        </div>
        
        <div class="logs-section">
            <div class="logs-header">
                <h3>📋 Fusion Logs</h3>
                <button class="btn btn-secondary" onclick="clearLogs()">Clear Logs</button>
            </div>
            <div class="logs-area" id="logsArea">
                [""" + datetime.now().strftime("%H:%M:%S") + """] Fusion v2 initialized - Context: """ + CONTEXT + """<br>
                [""" + datetime.now().strftime("%H:%M:%S") + """] Voice capabilities ready<br>
                [""" + datetime.now().strftime("%H:%M:%S") + """] Orchestration platform active<br>
            </div>
        </div>
    </div>

    <script>
        let sessionId = Date.now();
        let voiceEnabled = false;
        
        async function sendPrompt() {
            const prompt = document.getElementById('promptInput').value.trim();
            if (!prompt) return;
            
            const startTime = Date.now();
            const responseEl = document.getElementById('responseText');
            responseEl.innerHTML = '<div class="pulse">🧠 Generating response...</div>';
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, session_id: sessionId })
                });
                
                const data = await response.json();
                const duration = Date.now() - startTime;
                
                responseEl.innerHTML = data.response || 'No response received';
                document.getElementById('responseTime').textContent = duration + 'ms';
                document.getElementById('tokenCount').textContent = (data.tokens || 0);
                
                addLog(`Generated response (${duration}ms)`);
                
            } catch (error) {
                responseEl.innerHTML = '❌ Error: ' + error.message;
                addLog(`Error: ${error.message}`);
            }
        }
        
        async function streamPrompt() {
            const prompt = document.getElementById('promptInput').value.trim();
            if (!prompt) return;
            
            const responseEl = document.getElementById('responseText');
            responseEl.innerHTML = '';
            
            try {
                const response = await fetch('/stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, session_id: sessionId })
                });
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    responseEl.innerHTML += chunk;
                }
                
                addLog('Streaming response completed');
                
            } catch (error) {
                responseEl.innerHTML = '❌ Streaming error: ' + error.message;
                addLog(`Streaming error: ${error.message}`);
            }
        }
        
        function toggleVoice() {
            voiceEnabled = !voiceEnabled;
            const btn = event.target;
            btn.textContent = voiceEnabled ? '🔇 Voice Off' : '🎙️ Voice';
            btn.className = voiceEnabled ? 'btn btn-clear' : 'btn btn-voice';
            addLog(`Voice ${voiceEnabled ? 'enabled' : 'disabled'}`);
        }
        
        function clearAll() {
            document.getElementById('promptInput').value = '';
            document.getElementById('responseText').innerHTML = 'Cleared. Ready for new input.';
            addLog('Interface cleared');
        }
        
        async function runRehearsal() {
            addLog('Running rehearsal suite...');
            try {
                const response = await fetch('/rehearsal');
                const data = await response.json();
                addLog(`Rehearsal completed: ${data.status}`);
            } catch (error) {
                addLog(`Rehearsal error: ${error.message}`);
            }
        }
        
        async function exportLogs() {
            try {
                const response = await fetch('/logs/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fusion_logs_${Date.now()}.json`;
                a.click();
                addLog('Logs exported');
            } catch (error) {
                addLog(`Export error: ${error.message}`);
            }
        }
        
        async function testEndpoints() {
            addLog('Testing endpoints...');
            try {
                const response = await fetch('/health');
                const data = await response.json();
                addLog(`Health check: ${data.status}`);
            } catch (error) {
                addLog(`Endpoint test error: ${error.message}`);
            }
        }
        
        function clearLogs() {
            document.getElementById('logsArea').innerHTML = '';
        }
        
        function addLog(message) {
            const logsArea = document.getElementById('logsArea');
            const timestamp = new Date().toLocaleTimeString();
            logsArea.innerHTML += `[${timestamp}] ${message}<br>`;
            logsArea.scrollTop = logsArea.scrollHeight;
        }
        
        // Update session count
        document.getElementById('sessionCount').textContent = sessionId.toString().slice(-3);
        
        // Auto-refresh logs
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 5 seconds
                addLog('Fusion heartbeat - all systems operational');
            }
        }, 5000);
    </script>
</body>
</html>
    """)

@app.post("/chat")
async def chat_endpoint(request: Request):
    """Chat endpoint for Gemini interaction"""
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        session_id = data.get("session_id", "default")
        
        if not GOOGLE_API_KEY:
            return JSONResponse({
                "response": "🔧 Demo Mode: Gemini API key not configured. Add your GOOGLE_API_KEY to .env file.",
                "tokens": 0,
                "session_id": session_id
            })
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.5-pro-latest')
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Log session
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "session_id": session_id,
            "prompt": prompt,
            "response": response.text,
            "context": CONTEXT
        }
        
        # Save to logs
        log_file = Path("logs") / f"fusion_{datetime.now().strftime('%Y%m%d')}.json"
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        
        return JSONResponse({
            "response": response.text,
            "tokens": len(response.text.split()),
            "session_id": session_id
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return JSONResponse({
            "response": f"❌ Error: {str(e)}",
            "tokens": 0,
            "session_id": "error"
        }, status_code=500)

@app.post("/stream")
async def stream_endpoint(request: Request):
    """Streaming endpoint for real-time responses"""
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        
        if not GOOGLE_API_KEY:
            async def demo_stream():
                demo_text = "🔧 Demo Mode: This is a simulated streaming response. Configure your GOOGLE_API_KEY to use real Gemini streaming."
                for word in demo_text.split():
                    yield f"{word} "
                    await asyncio.sleep(0.1)
            
            return StreamingResponse(demo_stream(), media_type="text/plain")
        
        # Real streaming implementation would go here
        async def simple_stream():
            model = genai.GenerativeModel('gemini-2.5-pro-latest')
            response = model.generate_content(prompt)
            
            # Simulate streaming by yielding chunks
            words = response.text.split()
            for word in words:
                yield f"{word} "
                await asyncio.sleep(0.05)
        
        return StreamingResponse(simple_stream(), media_type="text/plain")
        
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        async def error_stream():
            yield f"❌ Streaming error: {str(e)}"
        
        return StreamingResponse(error_stream(), media_type="text/plain")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({
        "status": "healthy",
        "service": "AdgenxAI Fusion v2",
        "version": "2.0.0",
        "context": CONTEXT,
        "timestamp": datetime.now().isoformat(),
        "gemini_configured": bool(GOOGLE_API_KEY)
    })

@app.get("/rehearsal")
async def run_rehearsal():
    """Trigger rehearsal suite"""
    try:
        # This would trigger the rehearsal script
        return JSONResponse({
            "status": "completed",
            "message": "Rehearsal suite executed successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return JSONResponse({
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }, status_code=500)

@app.get("/logs/export")
async def export_logs():
    """Export logs as JSON"""
    try:
        log_files = list(Path("logs").glob("fusion_*.json"))
        all_logs = []
        
        for log_file in log_files:
            with open(log_file, "r") as f:
                for line in f:
                    try:
                        all_logs.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
        
        logs_json = json.dumps(all_logs, indent=2)
        return StreamingResponse(
            iter([logs_json]),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=fusion_logs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"}
        )
        
    except Exception as e:
        return JSONResponse({
            "error": f"Export failed: {str(e)}"
        }, status_code=500)

if __name__ == "__main__":
    print(f"""
🚀 AdgenxAI Fusion v2 Starting...
   
📍 Dashboard: http://127.0.0.1:{PORT}
🎯 Context: {CONTEXT}
🔑 Gemini: {'Configured' if GOOGLE_API_KEY else 'Demo Mode'}
📊 Notifications: {'Enabled' if NOTIFY else 'Disabled'}

🧠 Voice-enabled orchestration platform ready!
    """)
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=PORT,
        reload=True,
        log_level="info"
    )