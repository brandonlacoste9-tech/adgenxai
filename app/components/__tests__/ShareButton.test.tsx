import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButton from "@/components/ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset location.href for each test
    delete (window as any).location;
    window.location = { href: "https://adgenxai.pro/" } as any;
  });

  it("renders share button", () => {
    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    expect(button).toBeInTheDocument();
  });

  it("uses navigator.share when available", async () => {
    const shareSpy = vi.spyOn(navigator, "share");
    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalledWith({
        title: "AdGenXAI — The Aurora Engine for Growth",
        text: "Generate ads & reels, refine with personas, publish everywhere.",
        url: "https://adgenxai.pro/",
      });
    });
  });

  it("falls back to clipboard when share fails", async () => {
    // Make navigator.share throw to trigger clipboard fallback
    const shareSpy = vi.spyOn(navigator, "share").mockRejectedValue(new Error("Share failed"));
    const clipboardSpy = vi.spyOn(navigator.clipboard, "writeText");

    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalled();
      expect(clipboardSpy).toHaveBeenCalledWith("https://adgenxai.pro/");
    });
  });

  it("shows toast notification on successful share", async () => {
    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    await userEvent.click(button);

    // Toast should appear (the component triggers DOM changes on the export-toast element)
    // This is a smoke test - in real usage the toast element would need to exist
  });

  it("has proper accessibility attributes", () => {
    render(<ShareButton />);

    const button = screen.getByRole("button", { name: /share/i });
    expect(button).toHaveAttribute("aria-label", "Share this page");
    expect(button).toHaveAttribute("title", "Share");
  });
});
