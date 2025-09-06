'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Send error to Sentry
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', errorInfo);
      scope.setLevel('error');
      Sentry.captureException(error);
    });

    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Algo correu mal</CardTitle>
          <CardDescription>
            Ocorreu um erro inesperado. Nossa equipa foi notificada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 mb-2">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {error.toString()}
                {error.stack}
              </pre>
            </details>
          )}
          <div className="flex space-x-2">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Ir para início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Higher-order component for wrapping pages
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}