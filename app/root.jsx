import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { ErrorBoundary } from "~/components/ErrorBoundary";
import "./tailwind.css";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0",
  },
];

const NAV_ITEMS = [
  { to: "/", label: "Focus", icon: "timer" },
  { to: "/relax", label: "Relax", icon: "self_improvement" },
];

function AppNav() {
  return (
    <header
      className="sticky top-0 z-50 px-4 py-3 md:px-6"
      style={{
        background: "rgba(13,23,17,0.72)",
        WebkitBackdropFilter: "blur(12px) saturate(115%)",
        backdropFilter: "blur(12px) saturate(115%)",
        borderBottom: "1px solid rgba(190,210,195,0.12)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 20px -16px rgba(58,36,21,0.5)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(150deg, #f0bf76, #d8a24e)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px -8px rgba(234,180,100,0.5)",
            }}
            aria-hidden="true"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ color: "#16271d" }}
            >
              local_cafe
            </span>
          </span>
          <div className="leading-none">
            <span
              className="block font-headline text-xl font-light italic tracking-tight"
              style={{ color: "#edf0e4" }}
            >
              The Analog Sanctuary
            </span>
            <span
              className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#7c8d80" }}
            >
              a quiet place to focus
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              data-testid={to === "/" ? "nav-home" : "nav-relax"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "shadow-[inset_0_0_0_1px_rgba(234,180,100,0.30)]"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "rgba(234,180,100,0.16)", color: "#eab464" }
                  : undefined
              }
            >
              <span className="material-symbols-outlined text-[18px]">
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
    <div className="min-h-screen" style={{ background: "#0c1611" }}>
      <AppNav />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
