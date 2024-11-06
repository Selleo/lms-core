import { Link, useNavigate } from "@remix-run/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { isEmpty } from "lodash-es";
import { Trash } from "lucide-react";
import React from "react";

import { useCategoriesSuspense, usersQueryOptions } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import SortButton from "~/components/TableSortButton/TableSortButton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatHtmlString } from "~/lib/formatters/formatHtmlString";
import { cn } from "~/lib/utils";
import {
  type FilterConfig,
  type FilterValue,
  SearchFilter,
} from "~/modules/common/SearchFilter/SearchFilter";

import type { GetAllCategoriesResponse } from "~/api/generated-api";

type TCategory = GetAllCategoriesResponse["data"][number];

export const clientLoader = async () => {
  await queryClient.prefetchQuery(usersQueryOptions());

  return null;
};

const Categories = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [searchParams, setSearchParams] = React.useState<{
    title?: string;
    archived?: boolean;
  }>({});
  const [isPending, startTransition] = React.useTransition();
  const { data } = useCategoriesSuspense(searchParams);

  const filterConfig: FilterConfig[] = [
    {
      name: "title",
      type: "text",
      placeholder: "Search by title...",
    },
    {
      name: "archived",
      type: "status",
    },
  ];

  const handleFilterChange = (name: string, value: FilterValue) => {
    startTransition(() => {
      setSearchParams((prev) => ({
        ...prev,
        [name]: value,
      }));
    });
  };

  const columns: ColumnDef<TCategory>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => <SortButton<TCategory> column={column}>Title</SortButton>,
      cell: ({ row }) => (
        <div className="max-w-md truncate">{formatHtmlString(row.original.title)}</div>
      ),
    },
    {
      accessorKey: "archived",
      header: "Status",
      cell: ({ row }) => {
        const isArchived = row.original.archived;
        return (
          <Badge variant={isArchived ? "outline" : "secondary"} className="mx">
            {isArchived ? "Archived" : "Active"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortButton<TCategory> column={column}>Created At</SortButton>,
      cell: ({ row }) => row.original.createdAt && format(new Date(row.original.createdAt), "PPpp"),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const selectedCategories = table.getSelectedRowModel().rows.map((row) => row.original.id);

  const handleDelete = () => {
    alert("Not implemented");
  };

  const handleRowClick = (userId: string) => {
    navigate(userId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-2">
        <Link to="new">
          <Button variant="outline">Create New</Button>
        </Link>
        <SearchFilter
          filters={filterConfig}
          values={searchParams}
          onChange={handleFilterChange}
          isLoading={isPending}
        />
        <div className="flex gap-x-2 items-center px-4 py-2 ml-auto">
          <p
            className={cn("text-sm", {
              "text-neutral-500": isEmpty(selectedCategories),
              "text-neutral-900": !isEmpty(selectedCategories),
            })}
          >
            Selected ({selectedCategories.length})
          </p>
          <Button
            onClick={handleDelete}
            size="sm"
            className="flex items-center gap-x-2"
            disabled={isEmpty(selectedCategories)}
          >
            <Trash className="w-3 h-3" />
            <span className="text-xs">Delete selected</span>
          </Button>
        </div>
      </div>
      <Table className="bg-neutral-50 border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              onClick={() => handleRowClick(row.original.id)}
              className="cursor-pointer hover:bg-neutral-100"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Categories;
