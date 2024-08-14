import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { TableDisplay } from "./TableDisplay";
import { PaginationControls } from "./TablePaginationControls";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  Buttons?: React.ComponentType<{ id: string; setToast: () => void }> | null;
  setToast: () => void;
}

export function TableData<TData, TValue>({
  columns,
  data,
  Buttons,
  setToast = () => {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
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
      <TableDisplay
        setToast={setToast}
        table={table}
        columns={columns}
        Buttons={Buttons}
      />
      <PaginationControls
        table={table}
        pageIndex={pageIndex}
        pagesToShow={pagesToShow}
      />
    </>
  );
}
