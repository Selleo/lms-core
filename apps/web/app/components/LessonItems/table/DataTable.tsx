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
import { FilterInput } from "./components/FilterInput";
import { TableDisplay } from "./components/TableDisplay";
import { PaginationControls } from "./components/PaginationControls";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [statusSort, setStatusSort] = React.useState<string>("");
  const [typeSort, setTypeSort] = React.useState<string>("");
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
      <FilterInput
        table={table}
        statusSort={statusSort}
        setStatusSort={setStatusSort}
        typeSort={typeSort}
        setTypeSort={setTypeSort}
        setColumnFilters={setColumnFilters}
      />
      <TableDisplay table={table} columns={columns} />
      <PaginationControls
        table={table}
        pageIndex={pageIndex}
        pagesToShow={pagesToShow}
      />
    </>
  );
}
