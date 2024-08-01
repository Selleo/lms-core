import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Dashboard!" },
  ];
};

export default function DashboardPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-[300px] h-[300px] mx-auto mt-20">
        <img
          src="brand.svg"
          alt="brand"
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src="brand.svg"
          alt="brand"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 blur-xl z-10 opacity-40 animate-pulse"
        />
      </div>
    </div>
  );
}
