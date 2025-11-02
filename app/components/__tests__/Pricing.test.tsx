import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Pricing from "@/components/Pricing";

describe("Pricing - Cost Optimization Strategy", () => {
  it("renders the pricing section heading", () => {
    render(<Pricing />);

    expect(screen.getByRole("heading", { name: /simple, creator-friendly pricing/i })).toBeInTheDocument();
  });

  it("renders the pricing description", () => {
    render(<Pricing />);

    expect(screen.getByText(/monthly or yearly\. cancel anytime\./i)).toBeInTheDocument();
  });

  it("renders all three pricing tiers", () => {
    render(<Pricing />);

    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Creator")).toBeInTheDocument();
    expect(screen.getByText("Studio")).toBeInTheDocument();
  });

  it("displays optimized Creator tier pricing at $19/mo (33% reduction from $29)", () => {
    render(<Pricing />);

    // Check that Creator tier shows the new optimized price
    expect(screen.getByText("$19/mo")).toBeInTheDocument();
    
    // Verify Creator tier context
    const creatorSection = screen.getByText("Creator").closest("article");
    expect(creatorSection).toHaveTextContent("$19/mo");
    expect(creatorSection).toHaveTextContent("For daily creators");
  });

  it("displays optimized Studio tier pricing at $49/mo (50% reduction from $99)", () => {
    render(<Pricing />);

    // Check that Studio tier shows the new optimized price
    expect(screen.getByText("$49/mo")).toBeInTheDocument();
    
    // Verify Studio tier context
    const studioSection = screen.getByText("Studio").closest("article");
    expect(studioSection).toHaveTextContent("$49/mo");
    expect(studioSection).toHaveTextContent("For small teams");
  });

  it("maintains Starter tier pricing at $9/mo", () => {
    render(<Pricing />);

    expect(screen.getByText("$9/mo")).toBeInTheDocument();
    
    const starterSection = screen.getByText("Starter").closest("article");
    expect(starterSection).toHaveTextContent("$9/mo");
    expect(starterSection).toHaveTextContent("For getting started");
  });

  it("marks Creator tier as most popular", () => {
    render(<Pricing />);

    expect(screen.getByText("Most Popular")).toBeInTheDocument();
    
    const creatorSection = screen.getByText("Creator").closest("article");
    expect(creatorSection).toContainElement(screen.getByText("Most Popular"));
  });

  it("displays Creator tier features", () => {
    render(<Pricing />);

    expect(screen.getByText("1,000 renders/mo")).toBeInTheDocument();
    expect(screen.getByText("20 personas")).toBeInTheDocument();
    expect(screen.getByText("No watermark")).toBeInTheDocument();
    expect(screen.getByText("Priority queue")).toBeInTheDocument();
  });

  it("displays Studio tier features", () => {
    render(<Pricing />);

    expect(screen.getByText("Unlimited renders*")).toBeInTheDocument();
    expect(screen.getByText("Unlimited personas")).toBeInTheDocument();
    expect(screen.getByText("Brand kits")).toBeInTheDocument();
    expect(screen.getByText("SAML/SSO")).toBeInTheDocument();
  });

  it("has proper section with id for navigation", () => {
    const { container } = render(<Pricing />);

    const section = container.querySelector('#pricing');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe("SECTION");
  });

  it("displays call-to-action buttons", () => {
    render(<Pricing />);

    expect(screen.getByText("Start Free")).toBeInTheDocument();
    expect(screen.getByText("Upgrade")).toBeInTheDocument();
    expect(screen.getByText("Contact Sales")).toBeInTheDocument();
  });
});
