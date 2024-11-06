import { type Table as ReactTableInstance } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";

interface PaginationControls<TData> {
  table: ReactTableInstance<TData>;
  pageIndex: number;
  pagesToShow: number[];
}

export function PaginationControls<TData>({
  table,
  pageIndex,
  pagesToShow,
}: PaginationControls<TData>) {
  return (
    <div className="flex items-center justify-end w-full py-4">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        {pagesToShow.map((page) => (
          <Button
            key={page}
            variant={page === pageIndex ? "ghost" : "outline"}
            size="sm"
            onClick={() => table.setPageIndex(page)}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
