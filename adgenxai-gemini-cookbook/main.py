import subprocess
import sys
import os
import webbrowser

SCRIPTS = {
    "1": ("Quickstart: Text Generation", "src/quickstart/text_generation.py"),
    "2": ("Quickstart: Multimodal Input", "src/quickstart/multimodal_input.py"),
    "3": ("Tool Use: Function Calling", "src/tools/function_calling.py"),
    "4": ("Advanced: Batch Processing", "src/advanced/batch_processing.py"),
    "5": ("Real-Time: Voice Interaction", "src/live_api/voice_interaction.py"),
    "6": ("🌐 Launch Fusion Dashboard", "app.py"),
    "7": ("Exit", None)
}

def main():
    print("\n" + "="*60)
    print("🚀 AdgenxAI Gemini API Developer Launcher")
    print("   Neuromorphic AI + Google Gemini 2.5 Integration")
    print("="*60)
    print("Select a demo to run:\n")

    for key, (desc, _) in SCRIPTS.items():
        emoji = "🌐" if "Dashboard" in desc else "🔧" if key in ["3", "4"] else "⚡" if key == "5" else "📝" if key in ["1", "2"] else "❌"
        print(f"  {key}. {emoji} {desc}")
    print()

    choice = input("Enter option number: ").strip()
    if choice not in SCRIPTS:
        print("❌ Invalid option.")
        sys.exit(1)

    if choice == "7":
        print("👋 Exiting AdgenxAI Gemini Launcher.")
        sys.exit(0)

    desc, script = SCRIPTS[choice]
    
    if choice == "6":  # Fusion Dashboard
        print(f"\n🌐 Starting {desc}...")
        print("🔥 Voice-enabled Gemini streaming dashboard")
        print("📊 Real-time metrics and logging")
        print("🎙️ Speech input/output capabilities")
        print("\n🌍 Dashboard will open at: http://127.0.0.1:8000")
        
        # Start the FastAPI app
        subprocess.Popen([sys.executable, script])
        
        # Open browser after short delay
        import time
        time.sleep(2)
        webbrowser.open("http://127.0.0.1:8000")
        
        print("✅ Dashboard launched! Check your browser.")
        return
    
    path = os.path.join(os.getcwd(), script)
    if not os.path.exists(path):
        print(f"❌ Script not found: {path}")
        print("💡 Creating placeholder script...")
        
        # Create a placeholder script
        os.makedirs(os.path.dirname(path), exist_ok=True)
        placeholder_content = f'''"""
AdgenxAI Gemini Demo: {desc}

This is a placeholder script for the {desc} demo.
"""

print("🚧 {desc} - Coming Soon!")
print("📚 Part of the AdgenxAI Gemini API Developer Cookbook")
print("🔗 Integration with BeeHive Codex and neuromorphic workflows")
print("\\n💡 This demo will showcase:")

if "Text Generation" in "{desc}":
    print("   • Basic text generation with Gemini 2.5")
    print("   • Agent-First prompting patterns")
    print("   • BeeHive Metrics integration")
elif "Multimodal" in "{desc}":
    print("   • Image and text processing")
    print("   • Vision analysis capabilities")
    print("   • Brand assessment workflows")
elif "Function Calling" in "{desc}":
    print("   • Agent swarm coordination")
    print("   • BeeHive ritual automation")
    print("   • Tool use and API integration")
elif "Batch Processing" in "{desc}":
    print("   • High-volume content generation")
    print("   • Parallel agent workflows")
    print("   • Performance optimization")
elif "Voice Interaction" in "{desc}":
    print("   • Real-time audio processing")
    print("   • Speech-to-text integration")
    print("   • Live API demonstrations")

print("\\n🛠️ Run the main dashboard for full functionality:")
print("   python app.py")
'''
        
        with open(path, 'w') as f:
            f.write(placeholder_content)
        
        print(f"✅ Created: {path}")

    print(f"\n🎯 Running {desc}...")
    subprocess.run([sys.executable, path])

if __name__ == "__main__":
    main()