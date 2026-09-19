import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from 'react';

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  /** Changing this clears a caught error. Pass the route to recover on navigation. */
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === 'string') {
    return new Error(value);
  }
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

function DefaultFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="nudge-grid min-h-[100dvh] w-full px-6 py-16 text-[#182338]">
      <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#182338] font-mono text-xl text-[#f2775e]">
          !
        </div>
        <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.22em] text-[#a13d30]">
          Foundation interruption
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.06em]">
          Something needs a second look.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#696b68]">
          This part of Nudge hit an error. The rest of the shell can recover
          when you try again.
        </p>
        {/* Dev only: messages can carry API responses and other internals. */}
        {import.meta.env.DEV ? (
          <pre className="mt-5 w-full overflow-x-auto rounded-xl border border-[#e1ddd3] bg-[#f8f5ee] p-4 text-left text-xs text-[#696b68]">
            {error.message || String(error)}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={resetError}
          className="mt-6 rounded-full bg-[#f2775e] px-5 py-3 text-sm font-bold text-[#182338] transition-transform hover:-translate-y-0.5"
          data-testid="button-retry-error-boundary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: toError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error(
      'ErrorBoundary caught an error:',
      toError(error),
      info.componentStack,
    );
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.error !== null &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) {
      return this.props.children;
    }
    const Fallback = this.props.FallbackComponent ?? DefaultFallback;
    return <Fallback error={error} resetError={this.resetError} />;
  }
}
