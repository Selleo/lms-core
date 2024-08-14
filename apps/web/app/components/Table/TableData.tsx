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
  page: number;
  pageSize: number;
  dbLength: number;
  setToast: () => void;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleSelectPage: (page: number) => void;
}

export function TableData<TData, TValue>({
  columns,
  data,
  Buttons,
  page,
  pageSize,
  dbLength,
  setToast,
  handleNextPage,
  handlePreviousPage,
  handleSelectPage,
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
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const numberOfPage = Math.round(dbLength / pageSize);

  function pagesToShowFN(currentPage: number, totalPages: number) {
    const maxPagesToShow = 3;
    let startPage = Math.max(0, currentPage - 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  const pagesToShow = pagesToShowFN(page, numberOfPage);

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
        pageIndex={page}
        pagesToShow={pagesToShow}
        pageSize={pageSize}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handleSelectPage={handleSelectPage}
      />
    </>
  );
}
