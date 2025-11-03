import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopBar from "@/components/TopBar";

describe("TopBar", () => {
  const mockOnOpenPalette = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the AdGenXAI logo and navigation", () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    expect(screen.getByLabelText(/adgenxai home/i)).toBeInTheDocument();
    expect(screen.getByText("AdGenXAI")).toBeInTheDocument();
  });

  it("renders search input and command palette button", () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    // Search input (hidden on mobile)
    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", expect.stringContaining("⌘K"));

    // Command palette button
    const paletteButton = screen.getByRole("button", { name: /open command palette/i });
    expect(paletteButton).toBeInTheDocument();
  });

  it("calls onOpenPalette when ⌘K button is clicked", async () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    const paletteButton = screen.getByRole("button", { name: /open command palette/i });
    await userEvent.click(paletteButton);

    expect(mockOnOpenPalette).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenPalette when search input receives Enter key", async () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    const searchInput = screen.getByRole("searchbox");
    await userEvent.type(searchInput, "test query{Enter}");

    expect(mockOnOpenPalette).toHaveBeenCalledTimes(1);
  });

  it("renders theme toggle button", () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it("toggles theme when theme button is clicked", async () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    const initialContent = themeButton.textContent;

    await userEvent.click(themeButton);

    // Content should change (from ☀️ to 🌙 or vice versa)
    expect(themeButton.textContent).not.toBe(initialContent);
  });

  it("has proper accessibility attributes", () => {
    render(<TopBar onOpenPalette={mockOnOpenPalette} />);

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveAttribute("type", "search");

    const paletteButton = screen.getByRole("button", { name: /open command palette/i });
    expect(paletteButton).toHaveAttribute("aria-label");

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toHaveAttribute("aria-label");
  });
});
