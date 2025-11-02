"use client";

import { useState, useEffect } from "react";

interface ContentGeneration {
  id: string;
  type: "text" | "image" | "audio" | "social_post";
  prompt: string;
  model: string;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: number;
  completedAt?: number;
  contentUrl?: string;
  error?: string;
  duration?: number;
  platform?: string;
}

export default function GenerationsPage() {
  const [generations, setGenerations] = useState<ContentGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [newPrompt, setNewPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<"text" | "image" | "audio" | "social_post">("text");
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-4o");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data for now - replace with real API calls
    const mockGenerations: ContentGeneration[] = [
      {
        id: "gen_1",
        type: "text",
        prompt: "Write a product description for wireless headphones",
        model: "openai/gpt-4o",
        status: "completed",
        createdAt: Date.now() - 300000,
        completedAt: Date.now() - 240000,
        contentUrl: "/api/content/text/gen_1",
        duration: 60
      },
      {
        id: "gen_2",
        type: "social_post",
        prompt: "Create Instagram post about sustainable fashion",
        model: "gemini-pro",
        status: "processing",
        createdAt: Date.now() - 120000,
        platform: "instagram"
      },
      {
        id: "gen_3", 
        type: "image",
        prompt: "Modern minimalist workspace design",
        model: "dall-e-3",
        status: "queued",
        createdAt: Date.now() - 60000
      }
    ];
    
    setGenerations(mockGenerations);
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    setIsSubmitting(true);
    try {
      // Create mock generation for demo
      const newGeneration: ContentGeneration = {
        id: `gen_${Date.now()}`,
        type: selectedType,
        prompt: newPrompt,
        model: selectedModel,
        status: "queued",
        createdAt: Date.now()
      };

      setGenerations([newGeneration, ...generations]);
      setNewPrompt("");

      // Simulate processing
      setTimeout(() => {
        setGenerations(prev => 
          prev.map(gen => 
            gen.id === newGeneration.id 
              ? { ...gen, status: "processing" as const }
              : gen
          )
        );
      }, 1000);

      setTimeout(() => {
        setGenerations(prev => 
          prev.map(gen => 
            gen.id === newGeneration.id 
              ? { 
                  ...gen, 
                  status: "completed" as const,
                  completedAt: Date.now(),
                  duration: 45,
                  contentUrl: `/api/content/${selectedType}/${newGeneration.id}`
                }
              : gen
          )
        );
      }, 5000);

    } catch (error) {
      console.error("Failed to submit generation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGenerations = filter === "all" 
    ? generations 
    : generations.filter((gen) => gen.status === filter);

  const typeModels = {
    text: ["openai/gpt-4o", "openai/gpt-3.5-turbo", "gemini-pro", "claude-3"],
    image: ["dall-e-3", "midjourney", "stable-diffusion"],
    audio: ["eleven-labs", "whisper-tts"],
    social_post: ["gemini-pro", "openai/gpt-4o", "claude-3"]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
          Content Generations
        </h1>
        <p className="text-sm opacity-70 mt-2" style={{ color: "var(--text)" }}>
          Create and manage AI-generated content across multiple formats and platforms
        </p>
      </div>

      {/* New Generation Form */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text)" }}>
          Create New Content Generation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2 opacity-70"
              style={{ color: "var(--text)" }}
            >
              Prompt
            </label>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Describe the content you want to generate..."
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border resize-none focus:outline-none"
              style={{
                background: "var(--bg)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
            <div className="text-xs opacity-50 mt-2" style={{ color: "var(--text)" }}>
              {newPrompt.length}/2000 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2 opacity-70"
                style={{ color: "var(--text)" }}
              >
                Content Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  const newType = e.target.value as keyof typeof typeModels;
                  setSelectedType(newType);
                  setSelectedModel(typeModels[newType][0]);
                }}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                <option value="text">📝 Text Content</option>
                <option value="image">🎨 Image</option>
                <option value="audio">🎵 Audio</option>
                <option value="social_post">📱 Social Media Post</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 opacity-70"
                style={{ color: "var(--text)" }}
              >
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                {typeModels[selectedType].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!newPrompt.trim() || isSubmitting}
                className="w-full px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                style={{
                  background: "var(--accent)",
                  color: "var(--text)",
                }}
              >
                {isSubmitting ? "Creating..." : "Generate →"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {["all", "queued", "processing", "completed", "failed"].map((status) => {
          const count = status === "all" 
            ? generations.length 
            : generations.filter(g => g.status === status).length;
          
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status ? "opacity-100" : "opacity-50 hover:opacity-70"
              }`}
              style={{
                background: filter === status ? "var(--accent)" : "transparent",
                color: "var(--text)",
                border: `1px solid var(--border)`,
              }}
            >
              {status === "all"
                ? "All"
                : `${status.charAt(0).toUpperCase()}${status.slice(1)}`}{" "}
              ({count})
            </button>
          );
        })}
      </div>

      {/* Content Types Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "text", "image", "audio", "social_post"].map((type) => {
          const count = type === "all" 
            ? generations.length 
            : generations.filter(g => g.type === type).length;
          
          const typeIcons = {
            all: "🎯",
            text: "📝", 
            image: "🎨",
            audio: "🎵",
            social_post: "📱"
          };

          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filter === type ? "opacity-100" : "opacity-40 hover:opacity-60"
              }`}
              style={{
                background: filter === type ? "var(--accent)" : "var(--card)",
                color: "var(--text)",
                border: `1px solid var(--border)`,
              }}
            >
              {typeIcons[type as keyof typeof typeIcons]} {type === "all" ? "All Types" : type.replace("_", " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* Generations List */}
      {filteredGenerations.length > 0 ? (
        <div className="space-y-3">
          {filteredGenerations.map((generation) => (
            <GenerationCard key={generation.id} generation={generation} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="text-4xl mb-4">🚀</div>
          <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            No {filter !== "all" ? filter : ""} generations
          </div>
          <p className="text-sm opacity-50 mt-2" style={{ color: "var(--text)" }}>
            Create your first content generation above to get started
          </p>
        </div>
      )}
    </div>
  );
}

function GenerationCard({ generation }: { generation: ContentGeneration }) {
  const statusConfig = {
    queued: { icon: "⏳", color: "#f59e0b", label: "Queued" },
    processing: { icon: "⚙️", color: "#3b82f6", label: "Processing" },
    completed: { icon: "✅", color: "#10b981", label: "Completed" },
    failed: { icon: "❌", color: "#ef4444", label: "Failed" },
  };

  const typeIcons = {
    text: "📝",
    image: "🎨", 
    audio: "🎵",
    social_post: "📱"
  };

  const config = statusConfig[generation.status];
  const typeIcon = typeIcons[generation.type];
  const duration = generation.completedAt
    ? Math.round((generation.completedAt - generation.createdAt) / 1000)
    : "—";

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start gap-4">
        {/* Type & Status Icons */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl">{typeIcon}</div>
          <div className="text-lg">{config.icon}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2 mb-1" style={{ color: "var(--text)" }}>
                {generation.prompt}
              </h3>
              <div className="flex items-center gap-2 text-xs opacity-70" style={{ color: "var(--text)" }}>
                <span>{generation.model}</span>
                <span>•</span>
                <span>{generation.type.replace("_", " ")}</span>
                <span>•</span>
                <span>{new Date(generation.createdAt).toLocaleString()}</span>
                {generation.platform && (
                  <>
                    <span>•</span>
                    <span>{generation.platform}</span>
                  </>
                )}
              </div>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2"
              style={{
                background: `${config.color}20`,
                color: config.color,
              }}
            >
              {config.label}
            </span>
          </div>

          {/* Progress Bar */}
          {generation.status === "processing" && (
            <div className="mt-3 w-full bg-black/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  width: "60%",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Content Result */}
          {generation.status === "completed" && generation.contentUrl && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs opacity-70 mb-2" style={{ color: "var(--text)" }}>
                Content ready:
              </p>
              <a
                href={generation.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  background: "var(--accent)",
                  color: "var(--text)",
                }}
              >
                View Content →
              </a>
            </div>
          )}

          {/* Error Message */}
          {generation.status === "failed" && generation.error && (
            <div
              className="mt-3 pt-3 border-t text-xs"
              style={{ borderColor: "var(--border)", color: "#ef4444" }}
            >
              Error: {generation.error}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="text-right">
          <div className="text-sm font-mono opacity-70" style={{ color: "var(--text)" }}>
            {typeof duration === "number" ? `${duration}s` : duration}
          </div>
          <p className="text-xs opacity-50 mt-1" style={{ color: "var(--text)" }}>
            {generation.status === "processing"
              ? "Elapsed"
              : generation.status === "completed"
                ? "Duration"
                : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}