import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusPage from "../page";

describe("StatusPage", () => {
  it("renders the status page header", () => {
    render(<StatusPage />);
    
    expect(screen.getByText(/Sensory Cortex — Agent Mode Status Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Observation mode active/i)).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<StatusPage />);
    
    expect(screen.getByText(/Loading telemetry data/i)).toBeInTheDocument();
  });

  it("shows back to home link", () => {
    render(<StatusPage />);
    
    const homeLink = screen.getByRole("link", { name: /Back to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("displays system information section", () => {
    render(<StatusPage />);

    expect(screen.getByText(/System Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto-Refresh/i)).toBeInTheDocument();
    expect(screen.getByText(/Every Hour/i)).toBeInTheDocument();
  });

  it("has proper page structure", () => {
    render(<StatusPage />);
    
    // Check for main structural elements
    expect(screen.getByText(/AdGenXAI Sensory Cortex v1.0/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by Netlify Functions/i)).toBeInTheDocument();
  });
});
