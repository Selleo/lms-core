import {
  ColumnDef,
  flexRender,
  Table as ReactTableInstance,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { PaymnetButtonId } from "~/modules/Users/components/columns";

interface DataTableProps<TData, TValue> {
  table: ReactTableInstance<TData>;
  columns: ColumnDef<TData, TValue>[];
  Buttons?: React.ComponentType<{ id: string; setToast: () => void }> | null;
  setToast: () => void;
}

export function TableDisplay<TData, TValue>({
  table,
  columns,
  Buttons,
  setToast = () => {},
}: DataTableProps<TData, TValue>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const rowOriginal = { ...row.original } as PaymnetButtonId;
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {Buttons && (
                    <TableCell key={`button-${row.id}`}>
                      <Buttons id={rowOriginal.id} setToast={setToast} />
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
