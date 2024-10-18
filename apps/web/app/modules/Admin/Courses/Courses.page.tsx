import { useNavigate } from "@remix-run/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { isEmpty } from "lodash-es";
import { Trash } from "lucide-react";
import React from "react";
import { GetAllCoursesResponse } from "~/api/generated-api";
import {
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
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { cn } from "~/lib/utils";
import { CreateNewCourse } from "./CreateNewCourse";

type TCourse = GetAllCoursesResponse["data"][number];

export const clientLoader = async () => {
  await queryClient.prefetchQuery(allCoursesQueryOptions());
  return null;
};

const Courses = () => {
  const navigate = useNavigate();
  const { data } = useCoursesSuspense();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

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
      header: ({ column }) => (
        <SortButton<TCourse> column={column}>Title</SortButton>
      ),
    },
    {
      accessorKey: "author",
      header: ({ column }) => (
        <SortButton<TCourse> column={column}>Author</SortButton>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <SortButton<TCourse> column={column}>Category</SortButton>
      ),
    },
    {
      accessorKey: "priceInCents",
      header: ({ column }) => (
        <SortButton<TCourse> column={column}>Price</SortButton>
      ),
      cell: ({ row }) => {
        return formatPrice(row.original.priceInCents, row.original.currency);
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <Badge
          variant={row.original.state === "published" ? "secondary" : "outline"}
        >
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

  const selectedCourses = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const handleDeleteCourses = () => {
    // TODO: Implement archive functionality
    console.log("Deleting courses:", selectedCourses);
    table.resetRowSelection();
    queryClient.invalidateQueries(allCoursesQueryOptions());
  };

  const handleRowClick = (courseId: string) => {
    navigate(courseId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <CreateNewCourse />
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
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
