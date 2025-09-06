import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/nextjs';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  }
});

// Error handling link with Sentry integration
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.warn(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
      
      // Send GraphQL errors to Sentry
      Sentry.withScope((scope) => {
        scope.setTag('errorType', 'GraphQL');
        scope.setContext('GraphQL Error', {
          message,
          locations,
          path,
          operation: operation.operationName,
          variables: operation.variables,
        });
        scope.setLevel('error');
        Sentry.captureException(new Error(`GraphQL Error: ${message}`));
      });
    });
  }

  if (networkError) {
    console.warn(`Network error: ${networkError}`);
    
    // Send network errors to Sentry (except common ones)
    const ignoredErrors = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'];
    const shouldIgnore = ignoredErrors.some(error => networkError.message?.includes(error));
    
    if (!shouldIgnore) {
      Sentry.withScope((scope) => {
        scope.setTag('errorType', 'Network');
        scope.setContext('Network Error', {
          statusCode: networkError.statusCode,
          message: networkError.message,
          operation: operation.operationName,
          variables: operation.variables,
        });
        scope.setLevel('error');
        Sentry.captureException(networkError);
      });
    }
    
    // Retry mechanism for network errors
    if (networkError.statusCode === 500 || networkError.statusCode === 502 || networkError.statusCode === 503) {
      return forward(operation);
    }
  }
});

// Optimized cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Request: {
      fields: {
        // Cache individual requests by ID for efficient updates
        applications: {
          merge(existing = [], incoming) {
            return incoming;
          }
        },
        messages: {
          merge(existing = [], incoming) {
            return incoming;
          }
        }
      }
    },
    User: {
      fields: {
        requests: {
          merge(existing = [], incoming) {
            return incoming;
          }
        },
        applications: {
          merge(existing = [], incoming) {
            return incoming;
          }
        },
        reviewsReceived: {
          merge(existing = [], incoming) {
            return incoming;
          }
        }
      }
    },
    Query: {
      fields: {
        searchRequests: {
          // Cache search results with keyArgs for different search parameters
          keyArgs: ['input', ['category', 'status', 'location']],
          merge(existing = [], incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network', // Better UX with cached data first
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Use cache when possible
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
  // Enable query deduplication
  queryDeduplication: true,
  // Connection pool size optimization
  assumeImmutableResults: true,
});