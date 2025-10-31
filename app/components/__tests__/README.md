# Aurora UI Component Tests

This directory contains tests for the AdGenXAI Aurora UI components using Vitest and React Testing Library.

## Test Coverage

### Interactive Components
- **TopBar.test.tsx** - Tests navigation, theme toggle, and command palette trigger
- **CommandPalette.test.tsx** - Tests keyboard navigation, command execution, and dialog behavior
- **ShareButton.test.tsx** - Tests native share API and clipboard fallback

### Content Components
- **FeatureRail.test.tsx** - Tests feature card rendering and content

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

## Coverage

Coverage reports are generated in the `./coverage` directory when running `npm run test:ci`.

View the HTML report: `open coverage/index.html`
