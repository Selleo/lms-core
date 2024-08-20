import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { TableDisplay } from "./TableDisplay";
import { PaginationControls } from "./TablePaginationControls";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TableData<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const pageRange = (pageIndex: number) => {
    const start = Math.max(pageIndex - 1, 0);
    const end = Math.min(start + 2, pageCount - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pagesToShow = pageRange(pageIndex);

  return (
    <>
      <TableDisplay table={table} columns={columns} />
      <PaginationControls
        table={table}
        pageIndex={pageIndex}
        pagesToShow={pagesToShow}
      />
    </>
  );
}
