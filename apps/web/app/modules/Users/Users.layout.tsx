import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Users" }, { name: "description", content: "Users" }];
};

export default function UsersLayout() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
