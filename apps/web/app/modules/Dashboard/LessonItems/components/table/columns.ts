import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "displayName",
    header: "Display Name",
  },
  {
    accessorKey: "options",
    header: "Options",
    cell: (info) => info.getValue(), // render the content as is
  },
];
