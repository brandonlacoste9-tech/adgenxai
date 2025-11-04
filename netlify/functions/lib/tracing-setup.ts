// This file must be imported first to initialize tracing
import { initializeTracing } from '../../../lib/tracing';

// Initialize tracing for all Netlify Functions
if (process.env.NODE_ENV !== 'test') {
  initializeTracing();
}

export { initializeTracing };