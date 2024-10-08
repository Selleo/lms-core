import { Button } from "~/components/ui/button";

export default function CategoriesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Categories</h1>
        <Button>Create new</Button>
      </div>
    </div>
  );
}
