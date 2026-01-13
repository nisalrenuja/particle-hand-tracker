'use client';

import React, { Component, ReactNode } from 'react';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Optional fallback UI to display when an error occurs */
  fallback?: ReactNode;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
  /** Error info including component stack */
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the errors, and displays a fallback UI instead of crashing the app.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Log error details for debugging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * Reset error state and retry rendering
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default cyberpunk-themed error UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Header */}
            <div className="border-l-4 border-red-500 pl-4 mb-6">
              <h1 className="text-4xl font-mono font-bold text-red-500 mb-2">
                SYSTEM ERROR
              </h1>
              <p className="text-cyan-400 font-mono text-sm">
                CRITICAL FAILURE DETECTED
              </p>
            </div>

            {/* Error Message */}
            <div className="bg-red-950/30 border border-red-500/30 rounded p-6 mb-6">
              <p className="text-red-400 font-mono mb-4">
                The particle hand tracker encountered an unexpected error and
                needs to restart.
              </p>

              {/* Error Details */}
              {this.state.error && (
                <div className="bg-black/50 p-4 rounded border border-red-500/20">
                  <p className="text-red-300 font-mono text-sm mb-2">
                    Error: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-cyan-400 text-xs cursor-pointer hover:text-cyan-300">
                        View Stack Trace
                      </summary>
                      <pre className="text-red-200/60 text-xs mt-2 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold rounded transition-colors"
              >
                RETRY SYSTEM
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500 font-mono font-bold rounded transition-colors"
              >
                FULL RELOAD
              </button>
            </div>

            {/* System Info */}
            <div className="mt-8 border-l-2 border-cyan-500/30 pl-4">
              <p className="text-cyan-400/50 font-mono text-xs">
                ERROR CODE: {Date.now().toString(16).toUpperCase()}
              </p>
              <p className="text-cyan-400/50 font-mono text-xs">
                TIMESTAMP: {new Date().toISOString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
