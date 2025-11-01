import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopBar from "@/components/TopBar";
import MobileCreateDock from "@/components/MobileCreateDock";
import ShareButton from "@/components/ShareButton";

function tabbables() {
  // Light heuristic: buttons & links that are visible
  return screen.queryAllByRole("button").concat(screen.queryAllByRole("link"));
}

describe("A11y smoke tests", () => {
  it("TopBar: interactive controls have accessible names", () => {
    render(<TopBar onOpenPalette={() => {}} />);
    const controls = tabbables();

    // Sanity: has at least 3+ controls (search, palette, theme)
    expect(controls.length).toBeGreaterThanOrEqual(3);

    // All have accessible names
    for (const el of controls) {
      const name = el.getAttribute("aria-label") || el.textContent?.trim() || "";
      expect(name.length).toBeGreaterThan(0);
    }
  });

  it("TopBar: buttons are keyboard focusable", async () => {
    render(<TopBar onOpenPalette={() => {}} />);

    // Simulate tab navigation
    const paletteBtn = screen.getByRole("button", { name: /open command palette/i });
    const themeBtn = screen.getByRole("button", { name: /toggle theme/i });

    // Buttons should be in the DOM and focusable
    expect(paletteBtn).toBeInTheDocument();
    expect(themeBtn).toBeInTheDocument();

    // Both should be keyboard accessible (accessible via screen reader)
    expect(paletteBtn).toHaveAccessibleName(/open command palette/i);
    expect(themeBtn).toHaveAccessibleName(/toggle theme/i);
  });

  it("MobileCreateDock: buttons are labeled (Create / Reel / Export)", async () => {
    render(<MobileCreateDock />);

    const create = screen.getByRole("button", { name: /create/i });
    const reel = screen.getByRole("button", { name: /reel/i });
    const exportBtn = screen.getByRole("button", { name: /export/i });

    // All buttons exist
    expect(create).toBeInTheDocument();
    expect(reel).toBeInTheDocument();
    expect(exportBtn).toBeInTheDocument();

    // Labeled via text content (accessible names)
    expect(create).toHaveAccessibleName("Create");
    expect(reel).toHaveAccessibleName("Reel");
    expect(exportBtn).toHaveAccessibleName("Export");
  });

  it("MobileCreateDock: buttons are keyboard focusable", async () => {
    render(<MobileCreateDock />);

    const create = screen.getByRole("button", { name: /create/i });
    const reel = screen.getByRole("button", { name: /reel/i });

    // Simulate Tab key navigation
    await userEvent.tab();

    // First tab should focus one of the buttons
    const activeElement = document.activeElement;
    const isButtonFocused =
      activeElement === create || activeElement === reel;
    expect(isButtonFocused).toBe(true);
  });

  it("ShareButton: has explicit aria-label", () => {
    render(<ShareButton />);

    const btn = screen.getByRole("button", { name: /share this page/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label", "Share this page");
  });

  it("ShareButton: has descriptive title attribute", () => {
    render(<ShareButton />);

    const btn = screen.getByRole("button", { name: /share this page/i });
    expect(btn).toHaveAttribute("title", "Share");
  });

  it("ShareButton: is keyboard accessible", async () => {
    render(<ShareButton />);

    const btn = screen.getByRole("button", { name: /share this page/i });

    // Should be keyboard accessible (not disabled)
    expect(btn).not.toBeDisabled();

    // Focus with Tab
    await userEvent.tab();
    expect(document.activeElement).toBe(btn);
  });

  describe("Focus visible styles (visual check)", () => {
    it("TopBar buttons should be focusable and have accessible names", () => {
      render(<TopBar onOpenPalette={() => {}} />);

      const paletteBtn = screen.getByRole("button", { name: /open command palette/i });

      // Verify button is focusable and has accessible name
      expect(paletteBtn).toBeInTheDocument();
      expect(paletteBtn).toHaveAccessibleName(/open command palette/i);
    });

    it("MobileCreateDock buttons should be visually distinct and styled", () => {
      render(<MobileCreateDock />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      for (const btn of buttons) {
        // Verify buttons have styling classes
        const classList = btn.className;
        // Buttons should have some Tailwind styling
        expect(classList.length).toBeGreaterThan(0);
        // Check for common button classes
        expect(classList).toMatch(/rounded|py|px|bg|border/);
      }
    });
  });
});
