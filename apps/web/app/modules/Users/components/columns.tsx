import { ColumnDef } from "@tanstack/react-table";
import { extractDate } from "../hooks/extractDate";
import { upperFirstLetter } from "../hooks/upperFirstLetter";

export type PaymnetButtonId = {
  id: string;
};

export type Payment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "admin" | "student" | "tutor";
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "full-name",
    header: "Full Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => upperFirstLetter(row.original.role),
  },
  {
    accessorKey: "account-status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Date of registration",
    cell: ({ row }) => extractDate(row.original.createdAt),
  },
];
