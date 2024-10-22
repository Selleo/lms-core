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
import { GetAllLessonsResponse } from "~/api/generated-api";
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
import { cn } from "~/lib/utils";

type TLesson = GetAllLessonsResponse["data"][number];

const Lessons = () => {
  const navigate = useNavigate();
  const { data: lessons } = useAllLessonsSuspense();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

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
      header: ({ column }) => (
        <SortButton<TLesson> column={column}>Title</SortButton>
      ),
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
      accessorKey: "itemsCount",
      header: ({ column }) => (
        <SortButton<TLesson> column={column}>Items Count</SortButton>
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

  const selectedLessons = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const handleDeleteLessons = () => {
    // Implement delete functionality here
    console.log("Deleting lessons:", selectedLessons);
  };

  const handleRowClick = (lessonId: string) => {
    navigate(lessonId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex gap-x-2 items-center px-4 py-2 ml-auto">
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

export default Lessons;
