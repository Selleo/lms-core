import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Toaster } from "~/components/ui/toaster";
import "./index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
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
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <div />;
}
