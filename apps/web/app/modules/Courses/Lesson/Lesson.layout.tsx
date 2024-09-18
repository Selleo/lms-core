import { Outlet } from "@remix-run/react";
import Breadcrumb from "./Breadcrumb";

export default function LessonLayout() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb />
      <Outlet />
    </div>
  );
}
