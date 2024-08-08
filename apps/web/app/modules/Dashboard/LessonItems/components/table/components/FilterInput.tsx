import { Button } from "~/components/ui/button";
import * as React from "react";
import {
  ColumnFiltersState,
  Table as ReactTableInstance,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { LessonItemsButton } from "../../LessonItemsButton";

interface FilterInputProps<TData> {
  table: ReactTableInstance<TData>;
  statusSort: string;
  setStatusSort: React.Dispatch<React.SetStateAction<string>>;
  typeSort: string;
  setTypeSort: React.Dispatch<React.SetStateAction<string>>;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function FilterInput<TData>({
  table,
  statusSort,
  setStatusSort,
  typeSort,
  setTypeSort,
  setColumnFilters,
}: FilterInputProps<TData>) {
  const handleStatusSort = (value: string, label: string) => {
    table.getColumn("status")?.setFilterValue(value);
    setStatusSort("by " + label);
  };

  const handleTypeSort = (value: string, label: string) => {
    table.getColumn("type")?.setFilterValue(value);
    setTypeSort("by " + label);
  };

  const resetFilters = () => {
    setColumnFilters([]);
    handleStatusSort("", "");
    handleTypeSort("", "");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center py-4">
        <Input
          placeholder="Search by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Status sort {statusSort}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                handleStatusSort("Published first", "Published first")
              }
              className="cursor-pointer"
            >
              Published first
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleStatusSort("Draft first", "Draft first")}
              className="cursor-pointer"
            >
              Draft first
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Type sort {typeSort}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleTypeSort("Video", "Video")}
              className="cursor-pointer"
            >
              Video
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleTypeSort("Text", "Text")}
              className="cursor-pointer"
            >
              Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={resetFilters} variant="outline">
          Reset
        </Button>
      </div>
      <LessonItemsButton />
    </div>
  );
}
