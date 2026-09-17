'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates the WebGL canvas so a 3D runtime error (lost context, asset failure,
 * driver bug) degrades to the accessible fallback rather than taking down the
 * whole page. Critical content never lives only inside the canvas, so the
 * fallback is always a complete experience.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    this.props.onError?.(error);
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[CanvasErrorBoundary] 3D scene failed, showing fallback:', error);
    }
  }

  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
