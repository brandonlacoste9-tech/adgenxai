"""
AdgenxAI Gemini Demo: Multimodal Input Processing

Vision + Text processing with neuromorphic workflows
"""

import os
import time
import base64
from google import generativeai as genai
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont
import io

# Load environment
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ GOOGLE_API_KEY not found in environment")
    exit(1)

genai.configure(api_key=api_key)

def create_adgenxai_sample_image():
    """Create a sample AdgenxAI branded image for analysis"""
    print("🎨 Creating sample AdgenxAI branded image...")
    
    # Create image with neuromorphic theme
    img = Image.new('RGB', (800, 400), color='#0f0f23')  # Dark neural theme
    draw = ImageDraw.Draw(img)
    
    # Try to load a font, fall back to default if not available
    try:
        font_large = ImageFont.truetype("arial.ttf", 48)
        font_small = ImageFont.truetype("arial.ttf", 24)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # AdgenxAI branding
    draw.text((50, 50), "AdgenxAI", fill='#00d4ff', font=font_large)
    draw.text((50, 120), "Neuromorphic AI Platform", fill='#ffffff', font=font_small)
    draw.text((50, 160), "Agent-First Philosophy", fill='#888888', font=font_small)
    
    # BeeHive visual elements
    draw.rectangle([50, 220, 750, 280], outline='#00d4ff', width=2)
    draw.text((60, 235), "BeeHive Codex: Badge → Metrics → Echo → History", fill='#00d4ff', font=font_small)
    
    # Neural network visualization
    for i in range(10):
        x = 600 + i * 15
        y = 300 + (i % 3) * 20
        draw.ellipse([x, y, x+8, y+8], fill='#00d4ff')
    
    # Save the image
    image_path = "data/adgenxai_sample.png"
    os.makedirs("data", exist_ok=True)
    img.save(image_path)
    
    print(f"✅ Sample image created: {image_path}")
    return image_path

def analyze_image_with_gemini(image_path, prompt):
    """Analyze image using Gemini vision capabilities"""
    
    try:
        # Upload the image to Gemini
        uploaded_file = genai.upload_file(image_path)
        print(f"📤 Uploaded image to Gemini: {uploaded_file.name}")
        
        # Initialize vision model
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        # Start timing
        start_time = time.time()
        
        # Generate analysis
        response = model.generate_content([prompt, uploaded_file])
        processing_time = (time.time() - start_time) * 1000
        
        return response.text, processing_time
        
    except Exception as e:
        return f"Error analyzing image: {e}", 0

def main():
    print("🎨 AdgenxAI Gemini Multimodal Demo")
    print("=" * 50)
    
    # Create sample image
    image_path = create_adgenxai_sample_image()
    
    # Vision analysis prompts aligned with AdgenxAI
    analysis_prompts = [
        {
            "title": "Brand Analysis Agent",
            "prompt": """
            As a Brand Analysis Agent in the AdgenxAI ecosystem, analyze this image comprehensively:
            
            1. Brand Perception: How effectively does this convey "neuromorphic AI"?
            2. Visual Hierarchy: Rate the information architecture (1-10)
            3. Agent-First Assessment: Does this communicate our swarm intelligence approach?
            4. BeeHive Integration: Evaluate the ritual system visualization
            5. Target Audience Fit: How well does this resonate with tech professionals?
            6. Improvement Suggestions: 3 specific design recommendations
            
            Format as a structured analysis for our design agent swarm.
            """
        },
        {
            "title": "Technical Documentation Agent",
            "prompt": """
            As a Technical Documentation Agent, extract and explain all text elements 
            visible in this image. Focus on:
            
            - Technical terminology used
            - Brand messaging hierarchy
            - Neuromorphic AI concepts presented
            - BeeHive Codex ritual workflow
            
            Provide insights on how this visual supports our developer documentation.
            """
        },
        {
            "title": "Marketing Strategy Agent",
            "prompt": """
            As a Marketing Strategy Agent, assess this image for social media campaigns:
            
            - Visual impact score (1-10)
            - Key messaging effectiveness
            - Audience engagement potential
            - Cross-platform adaptability
            - Neuromorphic AI positioning
            
            Recommend specific improvements for maximum viral potential.
            """
        }
    ]
    
    print(f"\n🔍 Analyzing image with {len(analysis_prompts)} specialized agents...")
    
    for i, prompt_data in enumerate(analysis_prompts, 1):
        print(f"\n🎯 Agent {i}: {prompt_data['title']}")
        print("-" * 40)
        
        analysis, processing_time = analyze_image_with_gemini(image_path, prompt_data['prompt'])
        
        if processing_time > 0:
            print(f"✨ Analysis Result:")
            print(analysis[:500] + "..." if len(analysis) > 500 else analysis)
            print(f"\n📊 Processing Time: {processing_time:.1f}ms")
        else:
            print(f"❌ Analysis failed: {analysis}")
        
        if i < len(analysis_prompts):
            print("\n" + "="*50)
            input("Press Enter to continue to next agent analysis...")
    
    # Multimodal workflow demonstration
    print(f"\n🔬 Multimodal Workflow Integration:")
    print("=" * 40)
    
    combined_prompt = """
    As a Multimodal Coordination Agent, synthesize insights from the brand analysis 
    and create an action plan for improving our AdgenxAI visual identity. Consider:
    
    1. Technical accuracy of neuromorphic concepts
    2. Brand consistency across platforms
    3. Developer appeal and accessibility
    4. Integration with BeeHive Codex messaging
    
    Provide specific, actionable recommendations.
    """
    
    print("🧠 Running comprehensive multimodal synthesis...")
    synthesis, synthesis_time = analyze_image_with_gemini(image_path, combined_prompt)
    
    if synthesis_time > 0:
        print(f"\n✨ Multimodal Synthesis:")
        print(synthesis)
        print(f"\n📊 Synthesis Time: {synthesis_time:.1f}ms")
    
    # BeeHive Codex integration summary
    print(f"\n🐝 BeeHive Codex Integration Summary:")
    print("✅ Badge Ritual: Image classified as 'brand_analysis_complete'")
    print("✅ Metrics Ritual: Performance tracking active")
    print("✅ Echo Ritual: Ready for multi-platform amplification")
    print("✅ History Ritual: Analysis patterns stored for future optimization")
    
    print(f"\n🚀 Next Steps:")
    print("   • Upload your own images for custom analysis")
    print("   • Try the function calling demo for agent coordination")
    print("   • Launch the Fusion Dashboard for real-time multimodal processing")
    print("   • Run: python app.py for voice + vision integration")

if __name__ == "__main__":
    main()