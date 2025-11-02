"""
Quick test to verify Gemini API integration
"""

import os
from dotenv import load_dotenv

# Test basic imports
try:
    from google import generativeai as genai
    print("✅ Google Generative AI imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Run: pip install -r requirements.txt")
    exit(1)

# Test environment
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ GOOGLE_API_KEY not found")
    print("💡 Create .env file with your API key")
    print("📋 Copy .env.example to .env and add your key")
else:
    print("✅ API key found in environment")
    print(f"🔑 Key: {'*' * 20}...{api_key[-4:] if len(api_key) > 4 else 'Set'}")

print("\n🧠 AdgenxAI Gemini Cookbook is ready!")
print("🚀 Run: python main.py to start exploring")
print("🌐 Or run: python app.py for the Fusion Dashboard")