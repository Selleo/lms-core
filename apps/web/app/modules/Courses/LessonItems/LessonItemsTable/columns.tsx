import { type ColumnDef } from "@tanstack/react-table";

export type LessonItemsColumns = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  video: null | string | File | FileList;
};

export const columns: ColumnDef<LessonItemsColumns>[] = [
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
    cell: (info) => info.getValue(),
  },
];
