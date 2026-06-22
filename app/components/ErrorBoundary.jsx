import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#0c1611" }}>
          <div className="surface-card mx-4 max-w-md p-8 text-center">
            <span className="material-symbols-outlined text-4xl" style={{ color: "#eab464" }}>error_outline</span>
            <h2 className="mt-4 font-headline text-2xl font-light" style={{ color: "#edf0e4" }}>Something went wrong</h2>
            <p className="mt-2 text-sm" style={{ color: "#a7b6a9" }}>
              Please refresh the page to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-6"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
