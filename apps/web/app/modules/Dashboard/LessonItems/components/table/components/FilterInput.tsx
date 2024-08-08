import { Button } from "~/components/ui/button";
import * as React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Table as ReactTableInstance } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

interface FilterInputInterface<TData> {
  table: ReactTableInstance<TData>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function FilterInput<TData>({
  table,
  sortBy,
  setSortBy,
  setColumnFilters,
}: FilterInputInterface<TData>) {
  return (
    <div className="flex gap-4 items-center py-4">
      <Input
        placeholder={`Filter by ${sortBy}...`}
        value={(table.getColumn(sortBy)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(sortBy)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>Sort By</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {["title", "type", "status", "author"].map((option) => (
            <React.Fragment key={option}>
              <DropdownMenuItem
                onClick={() => setSortBy(option)}
                className="cursor-pointer"
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={() => setColumnFilters([])} variant="outline">
        Reset
      </Button>
    </div>
  );
}
