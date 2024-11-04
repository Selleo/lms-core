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
import { GetAllLessonItemsResponse } from "~/api/generated-api";
import {
  type LessonItemType,
  useAllLessonItemsSuspense,
} from "~/api/queries/admin/useAllLessonItems";
import SortButton from "~/components/TableSortButton/TableSortButton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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

type TLessonItem = GetAllLessonItemsResponse["data"][number];

const LessonItems = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchParams, setSearchParams] = useState<{
    title?: string;
    type?: LessonItemType;
    state?: string;
    archived?: boolean;
  }>({});
  const { data } = useAllLessonItemsSuspense(searchParams);
  const [isPending, startTransition] = useTransition();

  const filterConfig: FilterConfig[] = [
    {
      name: "title",
      type: "text",
      placeholder: "Search by title...",
    },
    {
      name: "type",
      type: "select",
      placeholder: "Types",
      options: [
        { value: "text_block", label: "Text Block" },
        { value: "question", label: "Question" },
        { value: "file", label: "File" },
      ],
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

  const columns: ColumnDef<TLessonItem>[] = [
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
        <SortButton<TLessonItem> column={column}>Title</SortButton>
      ),
      accessorFn: (row) =>
        row.itemType === "question" ? row.questionBody : row.title,
      cell: ({ row }) => {
        const content =
          row.original.itemType === "question"
            ? row.original.questionBody
            : row.original.title;
        return (
          <div className="max-w-md truncate">{formatHtmlString(content)}</div>
        );
      },
    },
    {
      accessorKey: "itemType",
      header: ({ column }) => (
        <SortButton<TLessonItem> column={column}>Type</SortButton>
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
      header: ({ column }) => (
        <SortButton<TLessonItem> column={column}>Created At</SortButton>
      ),
      cell: ({ row }) =>
        row.original.createdAt &&
        format(new Date(row.original.createdAt), "PPpp"),
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

  const selectedLessonItems = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const handleDeleteLessonItems = () => {
    // TODO: Implement delete functionality
    console.log("Deleting lesson items:", selectedLessonItems);
    table.resetRowSelection();
  };

  const handleRowClick = (lessonItemId: string) => {
    navigate(lessonItemId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Create New</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to="new-text-block">
              <DropdownMenuItem>Text Block</DropdownMenuItem>
            </Link>
            <Link to="new-question">
              <DropdownMenuItem>Question</DropdownMenuItem>
            </Link>
            <Link to="new-file">
              <DropdownMenuItem>File</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <SearchFilter
          filters={filterConfig}
          values={searchParams}
          onChange={handleFilterChange}
          isLoading={isPending}
        />

        <div className="flex gap-x-2 items-center px-4 py-2 ml-auto">
          <p
            className={cn("text-sm", {
              "text-neutral-900": !isEmpty(selectedLessonItems),
              "text-neutral-500": isEmpty(selectedLessonItems),
            })}
          >
            Selected ({selectedLessonItems.length})
          </p>
          <Button
            onClick={handleDeleteLessonItems}
            size="sm"
            className="flex items-center gap-x-2"
            disabled={isEmpty(selectedLessonItems)}
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
                    header.getContext(),
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

export default LessonItems;
