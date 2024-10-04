import { Outlet } from "@remix-run/react";

export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Outlet />
    </div>
  );
}
