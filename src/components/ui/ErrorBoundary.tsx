"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center rounded-xl border border-border bg-bg-card">
          <p className="text-text-muted text-sm">
            Error cargando {this.props.section || "esta sección"}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-xs text-accent hover:underline"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
