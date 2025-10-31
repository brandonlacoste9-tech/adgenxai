import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Streaming tests for PromptCard SSE support
 *
 * These tests are **SKIPPED** by default (it.skip) until you implement:
 * 1. A PromptCard component that streams from /api/chat?stream=1
 * 2. A data-testid="answer-stream" container for live tokens
 * 3. A data-testid="abort-stream" button to cancel in-flight requests
 *
 * Once implemented, change `it.skip` → `it` to enable these tests.
 */

// Mock component (placeholder until real PromptCard is built)
// Remove this once app/components/PromptCard.tsx exists
const PromptCard = () => <div data-testid="prompt-card">PromptCard placeholder</div>;

// Helper: create a ReadableStream that yields chunks over time
function streamChunks(chunks: string[], delay = 5) {
  const encoder = new TextEncoder();
  let i = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i++]));
        await new Promise((r) => setTimeout(r, delay));
      } else {
        controller.close();
      }
    },
  });
}

describe("PromptCard (SSE streaming)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  /**
   * SKIPPED: Unskip once streaming UI is live
   *
   * Requires:
   * - PromptCard component with streaming support
   * - /api/chat endpoint that responds with Content-Type: text/event-stream
   * - <div data-testid="answer-stream" aria-live="polite" />
   * - <button data-testid="abort-stream" /> to trigger AbortController.abort()
   * - fetch(`/api/chat?stream=1`, { signal: abortController.signal })
   */
  it.skip("renders tokens incrementally from /api/chat?stream=1 and supports Abort", async () => {
    const abortController = new AbortController();

    // Mock the streaming response
    const body = streamChunks([
      'data: {"delta":"Par"}\n\n',
      'data: {"delta":"is"}\n\n',
      'data: {"delta":" is"}\n\n',
      'data: {"delta":" the capital of France."}\n\n',
      "data: [DONE]\n\n",
    ]);

    (global.fetch as any) = vi.fn().mockImplementation((url: string, init: any) => {
      // Verify we call the streaming endpoint
      expect(url).toMatch(/\/api\/chat\?stream=1/);
      expect(init.signal).toBeDefined();

      return Promise.resolve(
        new Response(body, {
          headers: { "Content-Type": "text/event-stream; charset=utf-8" },
        })
      );
    });

    render(<PromptCard />);

    // Type a prompt
    const textarea = screen.getByPlaceholderText(/type your idea/i);
    await userEvent.type(textarea, "What is the capital of France?");

    // Click Generate
    const generate = screen.getByRole("button", { name: /generate/i });
    await userEvent.click(generate);

    // Expect incremental tokens to show up
    const out = await screen.findByTestId("answer-stream");
    await waitFor(() => expect(out.textContent).toMatch(/Par/));
    await waitFor(() => expect(out.textContent).toMatch(/Paris is the capital of France\./));

    // Abort should stop further processing
    const abortBtn = screen.getByTestId("abort-stream");
    await userEvent.click(abortBtn);

    // Verify fetch was called with AbortController signal
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/chat?stream=1"),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  /**
   * SKIPPED: Works with or without streaming
   *
   * Fallback behavior when /api/chat?stream=1 is unavailable
   * or component opts for non-streaming mode
   */
  it.skip("falls back to non-streaming when ?stream unsupported", async () => {
    (global.fetch as any) = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ answer: "Paris is the capital of France." }),
    });

    render(<PromptCard />);

    const textarea = screen.getByPlaceholderText(/type your idea/i);
    await userEvent.type(textarea, "What is the capital of France?");

    const generate = screen.getByRole("button", { name: /generate/i });
    await userEvent.click(generate);

    await waitFor(() => {
      expect(screen.getByText(/Paris is the capital of France\./)).toBeInTheDocument();
    });
  });

  /**
   * SKIPPED: Stream error handling
   *
   * Gracefully handles mid-stream errors (network, API, abort)
   */
  it.skip("handles stream errors gracefully", async () => {
    (global.fetch as any) = vi.fn().mockRejectedValue(new Error("Network timeout"));

    render(<PromptCard />);

    const textarea = screen.getByPlaceholderText(/type your idea/i);
    await userEvent.type(textarea, "What is the capital of France?");

    const generate = screen.getByRole("button", { name: /generate/i });
    await userEvent.click(generate);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  /**
   * SKIPPED: Abort mid-stream
   *
   * User clicks abort while response is streaming
   */
  it.skip("stops appending tokens when abort is clicked during stream", async () => {
    let resolveStream: (() => void) | null = null;
    const streamPromise = new Promise<void>((resolve) => {
      resolveStream = resolve;
    });

    const body = streamChunks([
      'data: {"delta":"The"}\n\n',
      'data: {"delta":" quick"}\n\n',
      'data: {"delta":" brown"}\n\n',
      // More would follow but we abort
    ]);

    (global.fetch as any) = vi.fn().mockImplementation((url: string, init: any) => {
      return Promise.resolve(
        new Response(body, {
          headers: { "Content-Type": "text/event-stream; charset=utf-8" },
        })
      );
    });

    render(<PromptCard />);

    const textarea = screen.getByPlaceholderText(/type your idea/i);
    await userEvent.type(textarea, "Start a story...");

    const generate = screen.getByRole("button", { name: /generate/i });
    await userEvent.click(generate);

    // Wait for partial content
    const out = await screen.findByTestId("answer-stream");
    await waitFor(() => expect(out.textContent).toMatch(/The quick/));

    // Click abort
    const abortBtn = screen.getByTestId("abort-stream");
    await userEvent.click(abortBtn);

    // No more tokens should arrive
    // (In real implementation, AbortController.signal will stop the fetch)
    const contentBefore = out.textContent;
    await new Promise((r) => setTimeout(r, 100));
    expect(out.textContent).toBe(contentBefore);
  });
});
