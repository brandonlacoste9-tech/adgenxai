# Aurora UI Component Tests

This directory contains tests for the AdGenXAI Aurora UI components using Vitest and React Testing Library.

## Test Coverage

### Interactive Components
- **TopBar.test.tsx** (7 tests) - Tests navigation, theme toggle, and command palette trigger
- **CommandPalette.test.tsx** (10 tests) - Tests keyboard navigation, command execution, and dialog behavior
- **ShareButton.test.tsx** (5 tests) - Tests native share API and clipboard fallback

### Content Components
- **FeatureRail.test.tsx** (6 tests) - Tests feature card rendering and content

### Accessibility Testing
- **a11y.smoke.test.tsx** (9 tests) - Smoke tests for:
  - TopBar: accessible names for interactive controls, keyboard navigation
  - MobileCreateDock: button labels, focus handling, keyboard accessibility
  - ShareButton: aria-label, title attributes, keyboard access
  - Focus visible styles and Tailwind class verification

### Streaming & Advanced Features (Scaffolded)
- **PromptCard.stream.test.tsx** (4 tests, all `it.skip()`) - Scaffolded tests for:
  - SSE streaming from `/api/chat?stream=1` with incremental token rendering
  - AbortController support for cancelling streams
  - Fallback behavior when streaming unavailable
  - Error handling for stream failures

  **Status**: Skipped by default. Unskip when PromptCard streaming component is implemented.

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode for development
npm run test:watch

# CI mode with coverage
npm run test:ci
```

## Writing New Tests

### Component Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import YourComponent from "@/components/YourComponent";

describe("YourComponent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly", () => {
    render(<YourComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    render(<YourComponent />);
    await userEvent.click(screen.getByRole("button"));
    expect(/* your assertion */);
  });
});
```

## Testing Patterns

### Client Components
All Aurora UI components use `"use client"` directive. The test setup in `vitest.setup.ts` handles Next.js mocks automatically.

### Theme Testing
Components using the theme system can be tested with the mocked `localStorage` and `matchMedia` APIs.

### Keyboard Interactions
Use `userEvent.keyboard()` for testing keyboard shortcuts:
```typescript
await userEvent.keyboard("{Escape}");
await userEvent.keyboard("{Enter}");
```

### Accessibility Testing
Always include accessibility checks:
```typescript
expect(button).toHaveAttribute("aria-label");
expect(dialog).toHaveAttribute("aria-modal", "true");
```

## Enabling Streaming Tests

When you implement the PromptCard streaming feature:

1. Create `app/components/PromptCard.tsx` with:
   - `<div data-testid="answer-stream" aria-live="polite" />` for live tokens
   - `<button data-testid="abort-stream" />` for cancellation
   - `fetch('/api/chat?stream=1', { signal: abortController.signal })`

2. Change `it.skip` to `it` in `PromptCard.stream.test.tsx`

3. Run `npm test` to verify streaming works

Example minimal implementation:
```tsx
export default function PromptCard() {
  const [stream, setStream] = useState('');
  const abortRef = useRef(new AbortController());

  async function startStream() {
    const res = await fetch('/api/chat?stream=1', {
      signal: abortRef.current.signal,
    });
    const reader = res.body?.getReader();
    // Parse SSE and append to state...
  }

  return (
    <>
      <div data-testid="answer-stream" aria-live="polite">{stream}</div>
      <button data-testid="abort-stream" onClick={() => abortRef.current.abort()}>
        Abort
      </button>
    </>
  );
}
```

## Coverage

Coverage reports are generated in the `./coverage` directory when running `npm run test:ci`.

View the HTML report: `open coverage/index.html`

## Test Results Summary

Current status: **37/41 tests passing** (4 streaming tests skipped, ready to unskip)
- 6 test files
- All core functionality covered
- Full a11y smoke tests passing
- CI workflow on every push
