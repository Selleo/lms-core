import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Outlet />
    </main>
  );
}
