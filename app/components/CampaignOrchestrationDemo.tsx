"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CampaignOrchestrationDemo() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const orchestrationSteps = [
    {
      id: 0,
      title: "Campaign Kickoff",
      description: "Initialize multi-agent campaign orchestration",
      icon: "🚀",
      status: "active"
    },
    {
      id: 1,
      title: "Content Generation",
      description: "AI agents create platform-specific content",
      icon: "✨",
      status: "pending"
    },
    {
      id: 2,
      title: "Review & Approval",
      description: "Human operator reviews generated assets",
      icon: "👁️",
      status: "pending"
    },
    {
      id: 3,
      title: "Multi-Platform Deploy",
      description: "Publish to Instagram, TikTok, YouTube",
      icon: "📱",
      status: "pending"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-900/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Campaign Orchestration
          </h2>
          <p className="text-lg text-purple-200">
            AI-powered multi-platform advertising automation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {orchestrationSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                activeStep === index
                  ? "border-purple-500 bg-purple-900/40"
                  : "border-purple-700/30 bg-purple-900/20 hover:border-purple-600/50"
              }`}
              onClick={() => setActiveStep(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-purple-200 text-sm">{step.description}</p>
              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    activeStep === index
                      ? "bg-purple-500 text-white"
                      : "bg-purple-700/30 text-purple-300"
                  }`}
                >
                  Step {index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-lg bg-purple-900/30 border border-purple-700/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            {orchestrationSteps[activeStep].title}
          </h3>
          <p className="text-purple-200">
            {orchestrationSteps[activeStep].description}
          </p>
        </div>
      </div>
    </section>
  );
}
