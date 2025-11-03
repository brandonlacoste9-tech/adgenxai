"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CampaignStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "completed" | "in-progress" | "pending";
  aiModel?: string;
}

export default function CampaignOrchestrationDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const campaignSteps: CampaignStep[] = [
    {
      id: "strategy",
      title: "Strategy Generation",
      description: "Kimi-Linear analyzes market and creates comprehensive strategy",
      icon: "🧠",
      status: "completed",
      aiModel: "Kimi-Linear"
    },
    {
      id: "content",
      title: "Content Creation",
      description: "Nitro-E and Ditto generate compelling ad copy and brand messaging",
      icon: "✍️",
      status: "completed",
      aiModel: "Nitro-E + Ditto"
    },
    {
      id: "visuals",
      title: "Visual Assets",
      description: "Hunyuan 3D creates stunning 3D product visualizations",
      icon: "🎨",
      status: "completed",
      aiModel: "Hunyuan 3D"
    },
    {
      id: "video",
      title: "Video Production",
      description: "LongCat generates engaging video content with narrative flow",
      icon: "🎬",
      status: "in-progress",
      aiModel: "LongCat Video"
    },
    {
      id: "distribution",
      title: "Global Distribution",
      description: "WorldGrow optimizes for international markets and platforms",
      icon: "🌍",
      status: "pending",
      aiModel: "WorldGrow"
    }
  ];

  const startDemo = () => {
    setIsAnimating(true);
    setCurrentStep(0);

    // Animate through steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= campaignSteps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <section className="py-24 px-4" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: "var(--text)" }}
          >
            🎯 Campaign Orchestration Engine
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-70 max-w-3xl mx-auto"
            style={{ color: "var(--text)" }}
          >
            One API call. 11 AI models. Complete marketing campaigns in seconds.
            Watch as our unified orchestration system coordinates multiple AI models to create your entire campaign automatically.
          </motion.p>
        </div>

        {/* Demo Control */}
        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startDemo}
            disabled={isAnimating}
            className="px-8 py-4 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isAnimating ? "var(--border)" : "var(--accent)",
              color: "var(--text)"
            }}
          >
            {isAnimating ? "🔄 Creating Campaign..." : "🚀 Start Demo"}
          </motion.button>
        </div>

        {/* Steps Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
          {campaignSteps.map((step, index) => {
            const isActive = index === currentStep && isAnimating;
            const isCompleted = index < currentStep || (!isAnimating && index === 0);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border transition-all ${
                  isActive ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
                style={{
                  background: "var(--card)",
                  borderColor: isActive ? "var(--accent)" : "var(--border)"
                }}
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
                  {step.title}
                </h3>
                <p className="text-sm opacity-70 mb-3" style={{ color: "var(--text)" }}>
                  {step.description}
                </p>
                {step.aiModel && (
                  <div className="text-xs font-medium px-2 py-1 rounded-full inline-block" style={{
                    background: "var(--accent)",
                    color: "var(--text)"
                  }}>
                    {step.aiModel}
                  </div>
                )}

                {/* Status Indicator */}
                <div className="mt-4">
                  {isCompleted && (
                    <span className="text-green-500">✓ Complete</span>
                  )}
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-blue-500"
                    >
                      ⚡ Processing
                    </motion.span>
                  )}
                  {!isCompleted && !isActive && (
                    <span className="opacity-50" style={{ color: "var(--text)" }}>
                      ○ Pending
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "80-90% Cost Savings",
              description: "Intelligent model routing and batch processing dramatically reduce costs",
              icon: "💰"
            },
            {
              title: "Unified API",
              description: "One simple endpoint coordinates all 11 AI models automatically",
              icon: "🔌"
            },
            {
              title: "Minutes, Not Weeks",
              description: "Complete campaigns created in minutes instead of weeks of manual work",
              icon: "⚡"
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-xl border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)"
              }}
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>
                {benefit.title}
              </h3>
              <p className="opacity-70" style={{ color: "var(--text)" }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="p-12 rounded-3xl border" style={{
            background: "var(--card)",
            borderColor: "var(--border)"
          }}>
            <h3 className="text-3xl font-bold mb-4" style={{ color: "var(--text)" }}>
              Ready to Orchestrate Your Campaign?
            </h3>
            <p className="text-lg opacity-70 mb-6 max-w-2xl mx-auto" style={{ color: "var(--text)" }}>
              Experience the power of unified AI orchestration. Create complete marketing campaigns with a single API call.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              style={{
                background: "var(--accent)",
                color: "var(--text)"
              }}
            >
              Get Started Now →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
