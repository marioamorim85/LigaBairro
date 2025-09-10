import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',

  beforeSend(event) {
    // Don't capture events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
      return null;
    }
    return event;
  },

  integrations: [],

  ignoreErrors: [
    // Ignore common server errors that are handled gracefully
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    // GraphQL errors (handled by error boundary)
    'GraphQL error',
  ],

  beforeBreadcrumb(breadcrumb) {
    // Filter out sensitive information from server breadcrumbs
    if (breadcrumb.data && breadcrumb.data.url) {
      // Remove query parameters that might contain sensitive data
      breadcrumb.data.url = breadcrumb.data.url.split('?')[0];
    }
    return breadcrumb;
  },
});