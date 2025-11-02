"""
AdgenxAI Gemini Demo: Basic Text Generation

Integration with BeeHive Codex and Agent-First Philosophy
"""

import os
import time
from google import generativeai as genai
from dotenv import load_dotenv

# Load environment
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ GOOGLE_API_KEY not found in environment")
    print("💡 Create a .env file with your Gemini API key")
    exit(1)

genai.configure(api_key=api_key)

class BeeHiveMetrics:
    """Simple metrics tracking for AdgenxAI integration"""
    
    def __init__(self):
        self.calls = []
    
    def record_api_call(self, model, latency_ms, token_count):
        self.calls.append({
            "timestamp": time.time(),
            "model": model,
            "latency_ms": latency_ms,
            "token_count": token_count
        })
    
    def get_performance_summary(self):
        if not self.calls:
            return "No calls recorded"
        
        avg_latency = sum(call["latency_ms"] for call in self.calls) / len(self.calls)
        total_tokens = sum(call["token_count"] for call in self.calls)
        
        return f"Calls: {len(self.calls)}, Avg Latency: {avg_latency:.1f}ms, Total Tokens: {total_tokens}"

def main():
    print("🧠 AdgenxAI Gemini Text Generation Demo")
    print("=" * 50)
    
    # Initialize BeeHive Metrics (Badge Ritual)
    metrics = BeeHiveMetrics()
    
    # Initialize Gemini models
    flash_model = genai.GenerativeModel('gemini-2.5-flash')
    pro_model = genai.GenerativeModel('gemini-2.5-pro')
    
    # Agent-First prompts aligned with AdgenxAI philosophy
    prompts = [
        {
            "title": "Neuromorphic Content Strategy",
            "prompt": """
            As a specialized Content Strategy Agent in the AdgenxAI ecosystem, create a compelling 
            social media post about the future of neuromorphic AI. 
            
            Context: Target audience is tech-savvy entrepreneurs and AI researchers
            Constraints: 280 characters max, include relevant hashtags
            Goal: Drive engagement while showcasing deep technical understanding
            
            Use Agent-First principles and BeeHive Codex integration.
            """
        },
        {
            "title": "Technical Documentation Agent",
            "prompt": """
            As a Technical Documentation Agent, explain the BeeHive Codex ritual system 
            in simple terms for developers new to AdgenxAI.
            
            Focus on:
            1. Badge Ritual - Content classification
            2. Metrics Ritual - Performance optimization  
            3. Echo Ritual - Amplification strategy
            4. History Ritual - Learning integration
            
            Make it accessible yet comprehensive.
            """
        },
        {
            "title": "Innovation Analyst Agent",
            "prompt": """
            As an Innovation Analyst Agent, assess the potential impact of combining 
            Google Gemini 2.5 with AdgenxAI's neuromorphic architecture.
            
            Consider:
            - Multimodal processing capabilities
            - Agent swarm coordination
            - Real-time streaming benefits
            - Production scalability
            
            Provide a strategic analysis with actionable insights.
            """
        }
    ]
    
    for i, prompt_data in enumerate(prompts, 1):
        print(f"\n🎯 Demo {i}: {prompt_data['title']}")
        print("-" * 40)
        
        # Use Flash model for quick responses
        start_time = time.time()
        
        try:
            response = flash_model.generate_content(prompt_data['prompt'])
            processing_time = (time.time() - start_time) * 1000
            
            print(f"✨ Response from Gemini 2.5 Flash:")
            print(response.text)
            print(f"\n📊 Performance: {processing_time:.1f}ms")
            
            # Record metrics (Metrics Ritual)
            metrics.record_api_call("gemini-2.5-flash", processing_time, len(response.text.split()))
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        if i < len(prompts):
            print("\n" + "="*50)
            input("Press Enter to continue to next demo...")
    
    # Echo Ritual - Performance Summary
    print(f"\n🔬 BeeHive Metrics Summary:")
    print(f"📈 {metrics.get_performance_summary()}")
    
    # History Ritual - Session Learning
    print(f"\n📚 Session Learning:")
    print("✅ Demonstrated Agent-First prompting patterns")
    print("✅ Integrated BeeHive Codex ritual system")
    print("✅ Showcased neuromorphic AI capabilities")
    print("✅ Performance metrics tracking active")
    
    print(f"\n🚀 Next Steps:")
    print("   • Try the multimodal demo for image processing")
    print("   • Explore function calling for agent coordination")
    print("   • Launch the Fusion Dashboard for voice interaction")
    print("   • Run: python app.py for the complete experience")

if __name__ == "__main__":
    main()