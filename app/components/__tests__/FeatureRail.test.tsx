import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeatureRail from "@/components/FeatureRail";

describe("FeatureRail", () => {
  it("renders the section heading", () => {
    render(<FeatureRail />);

    expect(screen.getByRole("heading", { name: /create\. remix\. broadcast\./i })).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<FeatureRail />);

    expect(screen.getByText(/built for modern creators/i)).toBeInTheDocument();
  });

  it("renders all four feature cards", () => {
    render(<FeatureRail />);

    expect(screen.getByText("Ad Generator")).toBeInTheDocument();
    expect(screen.getByText("Reels Studio")).toBeInTheDocument();
    expect(screen.getByText("Persona Engine")).toBeInTheDocument();
    expect(screen.getByText("Broadcast")).toBeInTheDocument();
  });

  it("displays feature descriptions", () => {
    render(<FeatureRail />);

    expect(screen.getByText(/turn prompts \+ personas into on-brand ads/i)).toBeInTheDocument();
    expect(screen.getByText(/storyboard, captions, and voice/i)).toBeInTheDocument();
    expect(screen.getByText(/reusable tones, styles, and audiences/i)).toBeInTheDocument();
    expect(screen.getByText(/one-click publish to tiktok, ig, youtube, x/i)).toBeInTheDocument();
  });

  it("displays icons for each feature", () => {
    render(<FeatureRail />);

    expect(screen.getByText("✦")).toBeInTheDocument(); // Ad Generator
    expect(screen.getByText("▶")).toBeInTheDocument(); // Reels Studio
    expect(screen.getByText("👤")).toBeInTheDocument(); // Persona Engine
    expect(screen.getByText("⤴")).toBeInTheDocument(); // Broadcast
  });

  it("has proper section with id for navigation", () => {
    const { container } = render(<FeatureRail />);

    const section = container.querySelector('#features');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe("SECTION");
  });
});
