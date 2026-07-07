import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useState, useEffect } from "react";

import { ErrorBoundary } from "~/components/ErrorBoundary";
import "./tailwind.css";

export const links = () => [
  { rel: "preload", href: "/figtree-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/material-symbols-outlined.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

const NAV_ITEMS = [
  { to: "/", label: "Focus", icon: "timer" },
  { to: "/relax", label: "Relax", icon: "self_improvement" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-[var(--color-background-muted)]"
    >
      <span className="material-symbols-outlined text-[18px] text-[var(--color-text-secondary)]">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}

function AppNav() {
  return (
    <header
      className="sticky top-0 z-50 px-4 py-3 md:px-6"
      style={{
        background: "var(--color-background-surface)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-low)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-element)]"
            style={{
              background: "var(--color-accent)",
              boxShadow: "var(--shadow-low)",
            }}
            aria-hidden="true"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ color: "var(--color-on-accent)" }}
            >
              local_cafe
            </span>
          </span>
          <div className="leading-none">
            <span
              className="block font-headline text-xl font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              The Analog Sanctuary
            </span>
            <span
              className="mt-1 block text-[10px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              a quiet place to focus
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                data-testid={to === "/" ? "nav-home" : "nav-relax"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-[var(--radius-full)] px-3.5 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? ""
                      : "hover:bg-[var(--color-background-muted)]"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: "var(--color-accent)", color: "var(--color-on-accent)" }
                    : { color: "var(--color-text-secondary)" }
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  {icon}
                </span>
                {label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: Figtree;
            font-style: normal;
            font-weight: 300 900;
            font-display: swap;
            src: url("/figtree-latin.woff2") format("woff2");
          }
          @font-face {
            font-family: "Material Symbols Outlined";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url("/material-symbols-outlined.woff2") format("woff2");
          }
        `}} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-background-body)" }}>
      <AppNav />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
