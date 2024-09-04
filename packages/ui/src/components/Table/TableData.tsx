import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { TableDisplay } from "./TableDisplay.js";
import { OptionButtonsProps } from "./Buttons/TableButtons.js";

export type StringMap<T> = {
  [key: string]: T;
};

export type SortLinkProps<TProperty> = {
  property: TProperty;
  direction?: "asc" | "desc";
  sortBy?: string;
  text: string | React.ReactNode;
};

export interface DataTableProps<TData, TValue, TProperty> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  Buttons?: React.ComponentType<OptionButtonsProps> | null;
  SortLink: React.ComponentType<SortLinkProps<TProperty>>;
  listProperties: TProperty[];
  href: string | null;
}

export function TableData<TData, TValue, TProperty>({
  columns,
  data,
  Buttons,
  SortLink,
  listProperties,
  href,
}: DataTableProps<TData, TValue, TProperty>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <>
      <TableDisplay
        SortLink={SortLink}
        listProperties={listProperties}
        table={table}
        columns={columns}
        Buttons={Buttons}
        href={href}
      />
    </>
  );
}

export type { ColumnDef } from "@tanstack/react-table";
