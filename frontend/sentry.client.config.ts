import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  
  beforeSend(event) {
    // Don't capture events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
      return null;
    }
    return event;
  },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      sampleRate: 0.1,
      errorSampleRate: 1.0,
    }),
  ],

  ignoreErrors: [
    // Ignore common browser extension errors
    'Non-Error exception captured',
    'Non-Error promise rejection captured',
    'Script error.',
    'ResizeObserver loop limit exceeded',
    // Apollo Client network errors (handled by Apollo error link)
    'NetworkError',
    'fetch',
  ],

  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    // Firefox extensions
    /^moz-extension:\/\//i,
  ],

  beforeBreadcrumb(breadcrumb) {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
      return null;
    }
    return breadcrumb;
  },
});