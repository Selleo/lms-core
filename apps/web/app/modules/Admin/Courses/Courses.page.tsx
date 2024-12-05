import { Link, useLoaderData, useNavigate } from "@remix-run/react";
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
import { startTransition, useState } from "react";

import { categoriesQueryOptions } from "~/api/queries";
import { ALL_COURSES_QUERY_KEY, useCoursesSuspense } from "~/api/queries/useCourses";
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

import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type { GetAllCoursesResponse } from "~/api/generated-api";

type TCourse = GetAllCoursesResponse["data"][number];

export const clientLoader = async (_: ClientLoaderFunctionArgs) => {
  const { data } = await queryClient.fetchQuery(categoriesQueryOptions());

  return data;
};

const Courses = () => {
  const categories = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<{
    title?: string;
    category?: string;
    state?: string;
    archived?: boolean;
    author?: string;
  }>({});
  const { data } = useCoursesSuspense(searchParams);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
      options: categories?.map(({ title }) => ({
        value: title,
        label: title,
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
      <div className="flex items-center justify-between gap-2">
        <Link to="new">
          <Button variant="outline">Create New</Button>
        </Link>
        <SearchFilter
          filters={filterConfig}
          values={searchParams}
          onChange={handleFilterChange}
          isLoading={false}
        />
        <div className="ml-auto flex items-center gap-x-2 px-4 py-2">
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
            <Trash className="h-3 w-3" />
            <span className="text-xs">Delete selected</span>
          </Button>
        </div>
      </div>
      <Table className="border bg-neutral-50">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead key={header.id} className={cn({ "size-12": index === 0 })}>
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
              {row.getVisibleCells().map((cell, index) => (
                <TableCell key={cell.id} className={cn({ "size-12": index === 0 })}>
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
