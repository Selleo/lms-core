import { flexRender, Table as ReactTableInstance } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.js";
import { useNavigate } from "react-router-dom";
import type { DataTableProps } from "./TableData.js";

type PickedTableDisplayProps<TData, TValue, TProperty> = Pick<
  DataTableProps<TData, TValue, TProperty>,
  "columns" | "Buttons" | "SortLink" | "listProperties" | "href"
>;

interface TableDisplayProps<TData, TValue, TProperty>
  extends PickedTableDisplayProps<TData, TValue, TProperty> {
  table: ReactTableInstance<TData>;
}

export function TableDisplay<TData, TValue, TProperty>({
  table,
  columns,
  Buttons,
  SortLink,
  listProperties,
  href,
}: TableDisplayProps<TData, TValue, TProperty>) {
  const navigate = useNavigate();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <SortLink
                          property={listProperties[header.index] as TProperty}
                          text={flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        />
                      </>
                    )}
                  </TableHead>
                );
              })}
              <TableHead key={"buttons"}></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const rowOriginal = { ...row.original } as {
                id: string;
                archived: boolean;
              };
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => {
                          navigate(`records/${rowOriginal.id}/show`);
                        }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                  {Buttons && (
                    <TableCell key={`button-${row.id}`}>
                      <Buttons
                        id={rowOriginal.id}
                        archived={rowOriginal.archived}
                        href={href || ""}
                      />
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (Buttons ? 1 : 0)}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
