import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
