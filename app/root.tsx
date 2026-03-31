import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
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
  { to: "/journal", label: "Journal", icon: "auto_stories" },
] as const;

function AppNav() {
  return (
    <header
      className="sticky top-0 z-50 px-4 py-3 md:px-6"
      style={{ background: "#f8f4db", borderBottom: "1px solid #d9c2b3" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span
          className="font-headline text-xl font-light italic tracking-tight"
          style={{ color: "#1d1c0d" }}
        >
          The Analog Sanctuary
        </span>

        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-fixed text-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `rounded-lg p-2 transition-colors ${
              isActive
                ? "bg-primary-fixed text-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`
          }
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-[20px]">
            settings
          </span>
        </NavLink>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen" style={{ background: "#fefae0" }}>
      <AppNav />
      <Outlet />
    </div>
  );
}
