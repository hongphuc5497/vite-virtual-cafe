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
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#fefae0" }}>
          <div className="mx-4 max-w-md rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)" }}>
            <span className="material-symbols-outlined text-4xl" style={{ color: "#8f4a00" }}>error_outline</span>
            <h2 className="mt-4 font-headline text-2xl font-light" style={{ color: "#1d1c0d" }}>Something went wrong</h2>
            <p className="mt-2 text-sm" style={{ color: "#544438" }}>
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
