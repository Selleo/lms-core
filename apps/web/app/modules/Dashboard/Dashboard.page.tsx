import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Dashboard!" },
  ];
};

export default function DashboardPage() {
  return <div></div>;
}
