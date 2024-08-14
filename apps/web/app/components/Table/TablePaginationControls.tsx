import { Button } from "~/components/ui/button";
import { Table as ReactTableInstance } from "@tanstack/react-table";

interface PaginationControls<TData> {
  table: ReactTableInstance<TData>;
  pageIndex: number;
  pagesToShow: number[];
  pageSize: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleSelectPage: (page: number) => void;
}

export function PaginationControls<TData>({
  table,
  pageIndex,
  pagesToShow,
  pageSize,
  handleNextPage,
  handlePreviousPage,
  handleSelectPage,
}: PaginationControls<TData>) {
  const canPreviousPage = pageIndex > 0;
  const canNextPage = table.getRowModel().rows.length === pageSize;

  return (
    <div className="flex items-center justify-end w-full py-4">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handlePreviousPage();
            table.previousPage();
          }}
          disabled={!canPreviousPage}
        >
          Previous
        </Button>
        {pagesToShow.map((page) => (
          <Button
            key={page}
            variant={page === pageIndex ? "ghost" : "outline"}
            size="sm"
            onClick={() => {
              handleSelectPage(page);
              table.setPageIndex(page);
            }}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleNextPage();
            table.nextPage();
          }}
          disabled={!canNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
