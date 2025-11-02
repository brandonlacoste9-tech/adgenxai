"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CampaignResult {
  campaign_id: string;
  status: string;
  assets: {
    ad_copy: {
      headline: string;
      description: string;
      cta: string;
      variations: string[];
    };
    product_3d_model?: {
      model_url: string;
      preview_url: string;
    };
    video_content: {
      main_video: {
        url: string;
        duration: number;
      };
      edited_variants: Array<{
        platform: string;
        aspect_ratio: string;
      }>;
    };
    thumbnails: Array<{
      variant_id: string;
      performance_score?: number;
    }>;
  };
  metadata: {
    models_used: string[];
    processing_time: number;
    cost_breakdown: {
      total_cost: number;
    };
    estimated_performance: {
      engagement_score: number;
      conversion_probability: number;
    };
  };
}

export default function CampaignOrchestrationDemo() {
  const [product, setProduct] = useState("eco water bottle");
  const [campaignType, setCampaignType] = useState("product_launch");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/.netlify/functions/create-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          campaign_type: campaignType,
          platforms: ['instagram', 'tiktok', 'youtube'],
          duration_seconds: 60
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Campaign creation failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Campaign creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#F7FAFF] to-[#E8F4FF] py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-[#071022] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🎯 One-Call Campaign Magic
          </motion.h2>
          <motion.p 
            className="text-xl text-[#071022]/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Watch AdGenXAI orchestrate all 11 AI models to create a complete campaign from a single request
          </motion.p>
        </div>

        {/* Demo Input */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-[#071022] mb-6">Create Your Campaign</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#071022] mb-2">Product</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent"
                placeholder="e.g., eco water bottle, wireless headphones"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#071022] mb-2">Campaign Type</label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent"
              >
                <option value="product_launch">Product Launch</option>
                <option value="brand_awareness">Brand Awareness</option>
                <option value="seasonal_promo">Seasonal Promotion</option>
                <option value="social_media">Social Media Campaign</option>
                <option value="video_ad">Video Advertisement</option>
              </select>
            </div>
          </div>

          <motion.button
            onClick={createCampaign}
            disabled={loading || !product.trim()}
            className="w-full bg-gradient-to-r from-[#7C4DFF] to-[#35E3FF] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Orchestrating 11 AI Models...
              </div>
            ) : (
              '🚀 Create Complete Campaign'
            )}
          </motion.button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#7C4DFF] border-t-transparent mb-4"></div>
              <h3 className="text-xl font-semibold text-[#071022] mb-2">AI Models Working...</h3>
              <div className="space-y-2 text-sm text-[#071022]/70">
                <div>🧠 Kimi-linear: Generating ad copy...</div>
                <div>🔮 Hunyuan 3D: Creating 3D product model...</div>
                <div>🌍 WorldGrow: Building environment scene...</div>
                <div>🎬 LongCat-Video: Producing video content...</div>
                <div>✂️ Ditto: Editing and optimizing...</div>
                <div>🖼️ Nitro-E: Generating thumbnail variants...</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">❌</div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Campaign Creation Failed</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#071022]">✅ Campaign Created Successfully!</h3>
              <div className="text-sm text-[#071022]/60">ID: {result.campaign_id}</div>
            </div>

            {/* Campaign Assets */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ad Copy */}
              <div className="bg-gradient-to-br from-[#7C4DFF]/5 to-[#35E3FF]/5 rounded-xl p-6">
                <h4 className="font-semibold text-[#071022] mb-3 flex items-center">
                  📝 Ad Copy <span className="ml-2 text-xs bg-[#7C4DFF] text-white px-2 py-1 rounded">Kimi-linear</span>
                </h4>
                <div className="space-y-2">
                  <div><strong>Headline:</strong> {result.assets.ad_copy.headline}</div>
                  <div><strong>Description:</strong> {result.assets.ad_copy.description}</div>
                  <div><strong>CTA:</strong> {result.assets.ad_copy.cta}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gradient-to-br from-[#FFD76A]/10 to-[#35E3FF]/10 rounded-xl p-6">
                <h4 className="font-semibold text-[#071022] mb-3">📊 AI Performance Prediction</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Engagement Score:</span>
                    <span className="font-semibold">{result.metadata.estimated_performance.engagement_score}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate:</span>
                    <span className="font-semibold">{(result.metadata.estimated_performance.conversion_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="font-semibold">{result.metadata.processing_time}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-semibold">${result.metadata.cost_breakdown.total_cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Models Used */}
              <div className="md:col-span-2 bg-gradient-to-r from-[#35E3FF]/5 to-[#7C4DFF]/5 rounded-xl p-6">
                <h4 className="font-semibold text-[#071022] mb-3">🤖 AI Models Orchestrated</h4>
                <div className="flex flex-wrap gap-2">
                  {result.metadata.models_used.map((model) => (
                    <span 
                      key={model}
                      className="bg-white border border-[#7C4DFF]/20 text-[#071022] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {model}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-[#071022]/70">
                  <div>📹 Video variants: {result.assets.video_content.edited_variants.length} platform-optimized versions</div>
                  <div>🖼️ Thumbnails: {result.assets.thumbnails.length} AI-optimized variants</div>
                  {result.assets.product_3d_model && <div>🔮 3D Model: Ready for AR/VR experiences</div>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-[#071022] mb-8">How The Magic Happens</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Intelligent Routing", desc: "AI analyzes your request and plans the optimal workflow" },
              { icon: "⚡", title: "Model Orchestration", desc: "All 11 models work together automatically" },
              { icon: "📦", title: "Complete Campaign", desc: "Get professional results in seconds, not hours" }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h4 className="font-semibold text-[#071022] mb-2">{step.title}</h4>
                <p className="text-[#071022]/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
