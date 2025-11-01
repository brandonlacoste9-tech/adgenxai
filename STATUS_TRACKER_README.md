# Sensory Cortex Status Tracker

## Overview

This implementation adds a dedicated status tracker page for the AdgenXAI Sensory Cortex at `/status`.

## What Was Created

### 1. Status Page (`/app/status/page.tsx`)
- **Route**: `/status`
- **Purpose**: Displays real-time health and telemetry data from the Sensory Cortex
- **Features**:
  - Real-time health status monitoring
  - Telemetry data visualization
  - Auto-refresh every hour
  - Manual refresh button
  - Error handling with user-friendly messages
  - Responsive design matching the existing app style

### 2. Theme Utilities (`/app/lib/theme.ts`)
- Provides theme management utilities for the TopBar component
- Supports light/dark mode switching
- Persists theme preference in localStorage
- System preference detection

### 3. Tests (`/app/status/__tests__/page.test.tsx`)
- Comprehensive test coverage for the status page
- Tests for:
  - Page rendering
  - Initial loading state
  - Navigation elements
  - System information display
  - Page structure

## How It Works

The status page fetches data from two Netlify Functions:

1. **Health Endpoint**: `/.netlify/functions/health`
   - Returns system health status
   - Shows uptime, active models, resources
   - Indicates "legendary" status when operational

2. **Telemetry Endpoint**: `/.netlify/functions/webhook-telemetry`
   - Returns telemetry statistics
   - Shows processing mode (observation)
   - Displays total events count
   - Shows time range for data

## Usage

### Accessing the Status Page

Simply navigate to `/status` in your browser when the app is deployed.

### Features

- **Auto-Refresh**: The page automatically refreshes data every hour
- **Manual Refresh**: Click the "Refresh Now" button to update immediately
- **Error Handling**: If the API is unavailable, a user-friendly error message is displayed
- **Navigation**: "Back to Home" link to return to the main page

## Deployment Notes

When deployed to Netlify:
- The static `/status` page will be served from the `out/` directory
- Netlify Functions will handle the `/api/*` endpoints through redirects
- The page will fetch data from `/.netlify/functions/health` and `/.netlify/functions/webhook-telemetry`

## Testing

Run the tests with:
```bash
npm test
```

All tests should pass, including the new status page tests.

## Build

Build the application with:
```bash
npm run build
```

The status page will be generated as a static HTML file in `out/status/index.html`.
