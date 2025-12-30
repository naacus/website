import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidMount() {
    // Handle global errors that occur in event handlers
    const handleError = (event) => {
      console.error('Global error caught:', event.error || event);
      // Prevent the error from being displayed
      event.preventDefault();
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the error from being displayed
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console for debugging
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
