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
import React, { startTransition } from "react";

import type { GetAllCoursesResponse } from "~/api/generated-api";
import { useCategories } from "~/api/queries";
import {
  ALL_COURSES_QUERY_KEY,
  allCoursesQueryOptions,
  useCoursesSuspense,
} from "~/api/queries/useCourses";
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
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { cn } from "~/lib/utils";
import {
  type FilterConfig,
  type FilterValue,
  SearchFilter,
} from "~/modules/common/SearchFilter/SearchFilter";

type TCourse = GetAllCoursesResponse["data"][number];

export const clientLoader = async () => {
  await queryClient.prefetchQuery(allCoursesQueryOptions());

  return null;
};

const Courses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = React.useState<{
    title?: string;
    category?: string;
    state?: string;
    archived?: boolean;
  }>({});
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data } = useCoursesSuspense(searchParams);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const filterConfig: FilterConfig[] = [
    {
      name: "title",
      type: "text",
      placeholder: "Search by title...",
    },
    {
      name: "category",
      type: "select",
      placeholder: "Categories",
      options: categories?.map((cat) => ({
        value: cat.title,
        label: cat.title,
      })),
    },
    {
      name: "state",
      type: "state",
      placeholder: "States",
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
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

  const columns: ColumnDef<TCourse>[] = [
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
      header: ({ column }) => <SortButton<TCourse> column={column}>Title</SortButton>,
      cell: ({ row }) => (
        <div className="max-w-md truncate">{formatHtmlString(row.original.title)}</div>
      ),
    },
    {
      accessorKey: "author",
      header: ({ column }) => <SortButton<TCourse> column={column}>Author</SortButton>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => <SortButton<TCourse> column={column}>Category</SortButton>,
    },
    {
      accessorKey: "priceInCents",
      header: ({ column }) => <SortButton<TCourse> column={column}>Price</SortButton>,
      cell: ({ row }) => {
        return formatPrice(row.original.priceInCents, row.original.currency);
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <Badge variant={row.original.state === "published" ? "secondary" : "outline"}>
          {row.original.state}
        </Badge>
      ),
    },
    {
      accessorKey: "archived",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.archived ? "outline" : "secondary"}>
          {row.original.archived ? "Archived" : "Active"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortButton<TCourse> column={column}>Created At</SortButton>,
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

  const selectedCourses = table.getSelectedRowModel().rows.map((row) => row.original.id);

  const handleDeleteCourses = () => {
    // TODO: Implement archive functionality
    alert("Not implemented");
    table.resetRowSelection();
    queryClient.invalidateQueries({ queryKey: ALL_COURSES_QUERY_KEY });
  };

  const handleRowClick = (courseId: string) => {
    navigate(courseId);
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
          isLoading={isCategoriesLoading}
        />
        <div className="flex gap-x-2 items-center px-4 py-2 ml-auto">
          <p
            className={cn("text-sm", {
              "text-neutral-900": !isEmpty(selectedCourses),
              "text-neutral-500": isEmpty(selectedCourses),
            })}
          >
            Selected ({selectedCourses.length})
          </p>
          <Button
            onClick={handleDeleteCourses}
            size="sm"
            className="flex items-center gap-x-2"
            disabled={isEmpty(selectedCourses)}
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

export default Courses;
