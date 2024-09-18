import { Outlet } from "@remix-run/react";
import Breadcrumb from "./Breadcrumb";
import Overview from "./Overview";
import Summary from "./Summary";

export default function LessonLayout() {
  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-8 w-full">
        <Breadcrumb />
        <Overview />
        <Outlet />
      </div>
      <Summary />
    </div>
  );
}
