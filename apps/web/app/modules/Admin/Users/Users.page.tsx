import React from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { isEmpty } from "lodash-es";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash } from "lucide-react";
import { GetUsersResponse } from "~/api/generated-api";
import { useBulkDeleteUsers } from "~/api/mutations/useBulkDeleteUsers";
import { useAllUsersSuspense, usersQueryOptions } from "~/api/queries/useUsers";
import { queryClient } from "~/api/queryClient";
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
import { useNavigate } from "@remix-run/react";
import { CreateNewUser } from "./CreateNewUser";

type TUser = GetUsersResponse["data"][number];

export const clientLoader = async () => {
  queryClient.prefetchQuery(usersQueryOptions);
  return null;
};

interface SortButtonProps<T> {
  column: Column<T, unknown>;
  children: React.ReactNode;
}

const SortButton = <T,>({ column, children }: SortButtonProps<T>) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="flex items-center"
  >
    {children}
    {column.getIsSorted() === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === "desc" ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    )}
  </Button>
);

const Users = () => {
  const navigate = useNavigate();
  const { data } = useAllUsersSuspense();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const { mutateAsync: deleteUsers } = useBulkDeleteUsers();

  const columns: ColumnDef<TUser>[] = [
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
      accessorKey: "firstName",
      header: ({ column }) => (
        <SortButton<TUser> column={column}>First Name</SortButton>
      ),
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <SortButton<TUser> column={column}>Last Name</SortButton>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortButton<TUser> column={column}>Email</SortButton>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
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

  const selectedUsers = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const handleDeleteUsers = () => {
    console.log(selectedUsers);
    deleteUsers({ data: { userIds: selectedUsers } }).then(() => {
      table.resetRowSelection();
      queryClient.invalidateQueries(usersQueryOptions);
    });
  };

  const handleRowClick = (userId: string) => {
    navigate(userId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <CreateNewUser />
        <div className="flex gap-x-2 items-center px-4 py-2 ml-auto">
          <p
            className={cn("text-sm", {
              "text-neutral-900": !isEmpty(selectedUsers),
              "text-neutral-500": isEmpty(selectedUsers),
            })}
          >
            Selected ({selectedUsers.length})
          </p>
          <Button
            onClick={handleDeleteUsers}
            size="sm"
            className="flex items-center gap-x-2"
            disabled={isEmpty(selectedUsers)}
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

export default Users;
