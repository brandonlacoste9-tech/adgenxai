# AdgenxAI Gemini API Developer Cookbook

🧠 **Neuromorphic AI meets Google Gemini 2.5** - Complete integration suite for the AdgenxAI platform

## 🚀 Quick Start

### 1. Interactive Command Launcher
Run the launcher for an interactive menu:

```bash
cd adgenxai-gemini-cookbook
python main.py
```

This opens an interactive menu where you can choose demos:
1. 📝 Text generation with Agent-First patterns
2. 🎨 Multimodal input (vision + text)
3. 🔧 Tool use and function calling
4. 🔧 Batch processing workflows
5. ⚡ Real-time voice interaction
6. 🌐 **Fusion Dashboard** (Complete voice-enabled interface)
7. ❌ Exit

### 2. Direct Dashboard Launch
For the full experience with voice, streaming, and logging:

```bash
python app.py
```

Then open: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 🎯 Key Features

### 🌐 **AdgenxAI Fusion Dashboard**
- **Real-time streaming**: Watch Gemini responses unfold live
- **Voice interaction**: 🎙️ Speak prompts, hear responses 
- **Dark theme**: Developer-optimized interface
- **Performance metrics**: Token count, latency tracking
- **Session logging**: Persistent JSON logs with search/export
- **BeeHive integration**: Neuromorphic workflow patterns

### 🧠 **Neuromorphic Integration**
- **Agent-First Philosophy**: Specialized AI agent patterns from David Ondrej
- **BeeHive Codex**: Four-ritual system (Badge → Metrics → Echo → History)
- **Swarm Intelligence**: Multi-agent coordination capabilities
- **Context Engineering**: Advanced prompt optimization

### 🎨 **Multimodal Capabilities**
- **Vision Processing**: Image analysis with brand assessment
- **Audio Integration**: Speech-to-text and text-to-speech
- **Function Calling**: Agent swarm coordination via API calls
- **Live API**: Real-time conversational AI

## 📁 Project Structure

```
adgenxai-gemini-cookbook/
├── app.py                    # 🌐 Main Fusion Dashboard
├── main.py                   # 🚀 Interactive launcher
├── requirements.txt          # 📦 Dependencies
├── README.md                # 📚 This file
├── .env.example             # 🔑 Environment template
│
├── src/                     # 🔧 Demo scripts
│   ├── quickstart/          # 📝 Basic examples
│   ├── tools/               # 🔧 Function calling
│   ├── live_api/            # ⚡ Real-time features
│   ├── advanced/            # 🎯 Complex workflows
│   └── deployment/          # 🚀 Production configs
│
├── data/                    # 📁 Sample files
├── logs/                    # 📊 Session logs
├── speech/                  # 🎙️ Audio files
└── .vscode/                 # ⚙️ VS Code config
```

## ⚙️ Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Create `.env` file:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. VS Code Integration
The included `.vscode/launch.json` provides:
- **Gemini Dashboard**: Launch the full web interface
- **Command Menu**: Run the interactive launcher

## 🎮 Usage Examples

### Basic Text Generation
```python
from google import generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-pro")
response = model.generate_content("Explain neuromorphic AI in simple terms")
print(response.text)
```

### Voice-Enabled Dashboard
1. Launch: `python app.py`
2. Open browser at `http://127.0.0.1:8000`
3. Click 🎙️ **Speak** to record voice input
4. Click **Stream** to get real-time Gemini response
5. Listen to automatic text-to-speech output

### Function Calling with BeeHive
```python
# Agent swarm coordination example
def coordinate_agent_swarm(task: str, agent_count: int = 3):
    return {
        "task_breakdown": "neuromorphic_cascade",
        "agents": ["Content Creator", "SEO Optimizer", "Performance Analyst"],
        "beehive_integration": "all_rituals_active"
    }

# Gemini can call this function automatically
```

## 🔬 Advanced Features

### Real-Time Streaming
- Server-Sent Events (SSE) for live token streaming
- Performance metrics (tokens/second, latency)
- Dynamic UI updates without page refresh

### Session Management
- **JSON logging**: Daily session files with full history
- **Search & filter**: Keyword and time-range queries
- **Export capability**: Download logs as JSON files
- **Clear functionality**: Reset session data

### Multimodal Processing
- **Image upload**: Drag & drop image analysis
- **Audio processing**: Voice input transcription
- **Combined workflows**: Text + image + audio prompts

## 🌟 Integration with AdgenxAI

This cookbook seamlessly integrates with:
- **BeeHive Codex**: Four-ritual neuromorphic system
- **Agent-First Philosophy**: Specialized AI agent patterns
- **Quantum Canvas**: 3D visualization engine (future integration)
- **Production deployment**: Netlify Functions ready

## 📊 Performance Monitoring

The dashboard provides real-time metrics:
- **Response latency**: Millisecond-precision timing
- **Token throughput**: Streaming rate measurement
- **Session analytics**: Historical performance data
- **Cost estimation**: Usage tracking (when configured)

## 🚀 Deployment

### Local Development
```bash
python app.py  # Development server
```

### Production Deployment
Ready for deployment on:
- **Netlify**: Serverless functions
- **Vercel**: Edge runtime
- **Railway**: Container deployment
- **Heroku**: Traditional hosting

## 🔗 Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [AdgenxAI Agent-First Philosophy](../docs/BEE_SHIP_COMPLETE_GUIDE.md)
- [BeeHive Codex Rituals](../docs/BEE_SHIP_API_DOCS.md)
- [Neuromorphic AI Patterns](../docs/BEE_SHIP_COMPLETE_PACKAGE.md)

## 🤝 Contributing

This cookbook is part of the AdgenxAI ecosystem. Contributions welcome:
1. Fork the repository
2. Create feature branch
3. Add neuromorphic AI patterns
4. Submit pull request with BeeHive integration

## 📄 License

MIT License - Part of the AdgenxAI platform

---

**🧠 Welcome to the future of neuromorphic AI development!** ✨