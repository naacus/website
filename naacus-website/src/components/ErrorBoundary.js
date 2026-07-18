import React from 'react';
import { recordException } from '../services/telemetryService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleError = this.handleError.bind(this);
    this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleError(event) {
    const error = event?.error || new Error(event?.message || 'Global window error');
    recordException(error, {
      'error.source': 'window.error',
      'error.filename': event?.filename || '',
      'error.lineno': event?.lineno || 0,
      'error.colno': event?.colno || 0,
    });

    console.error('Global error caught:', error);
    event.preventDefault();
  }

  handleUnhandledRejection(event) {
    const reason = event?.reason;
    const error = reason instanceof Error ? reason : new Error(String(reason || 'Unhandled promise rejection'));
    recordException(error, {
      'error.source': 'window.unhandledrejection',
    });

    console.error('Unhandled promise rejection:', reason);
    event.preventDefault();
  }

  componentDidMount() {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentDidCatch(error, errorInfo) {
    recordException(error, {
      'error.source': 'react.error_boundary',
      'react.component_stack': errorInfo?.componentStack || '',
    });

    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Suppress the error display and allow the app to continue
      // Log to console but don't show the error overlay
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
