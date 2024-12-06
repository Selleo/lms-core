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
import { useState, useTransition } from "react";

import { useAllLessonsSuspense } from "~/api/queries/admin/useAllLessons";
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

import type { GetAllLessonsResponse } from "~/api/generated-api";

type TLesson = GetAllLessonsResponse["data"][number];

const Lessons = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<{
    title?: string;
    state?: string;
    archived?: boolean;
  }>({});
  const [isPending, startTransition] = useTransition();
  const { data: lessons } = useAllLessonsSuspense(searchParams);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filterConfig: FilterConfig[] = [
    {
      name: "title",
      type: "text",
      placeholder: "Search by title...",
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

  const columns: ColumnDef<TLesson>[] = [
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
      header: ({ column }) => <SortButton<TLesson> column={column}>Title</SortButton>,
      cell: ({ row }) => (
        <div className="max-w-md truncate">{formatHtmlString(row.original.title)}</div>
      ),
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
      accessorKey: "itemsCount",
      header: ({ column }) => <SortButton<TLesson> column={column}>Items Count</SortButton>,
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
      header: ({ column }) => <SortButton<TLesson> column={column}>Created At</SortButton>,
      cell: ({ row }) => row.original.createdAt && format(new Date(row.original.createdAt), "PPpp"),
    },
  ];

  const table = useReactTable({
    data: lessons,
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

  const selectedLessons = table.getSelectedRowModel().rows.map((row) => row.original.id);

  const handleDeleteLessons = () => {
    //TODO: Implement delete functionality here
    console.log("Deleting lessons:", selectedLessons);
  };

  const handleRowClick = (lessonId: string) => {
    navigate(lessonId);
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
          isLoading={isPending}
        />
        <div className="ml-auto flex items-center gap-x-2 px-4 py-2">
          <p
            className={cn("text-sm", {
              "text-neutral-900": !isEmpty(selectedLessons),
              "text-neutral-500": isEmpty(selectedLessons),
            })}
          >
            Selected ({selectedLessons.length})
          </p>
          <Button
            onClick={handleDeleteLessons}
            size="sm"
            className="flex items-center gap-x-2"
            disabled={isEmpty(selectedLessons)}
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

export default Lessons;
