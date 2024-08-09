import { Button } from "~/components/ui/button";
import * as React from "react";
import {
  ColumnFiltersState,
  Table as ReactTableInstance,
} from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { LessonItemsButton } from "../../LessonItemsButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
  const [searchValue, setSearchValue] = React.useState<string>("");

  const handleStatusSort = (value: string, label: string) => {
    table
      .getColumn("status")
      ?.setFilterValue(value === "Status sort by" ? "" : value);
    setStatusSort(label);
  };

  const handleTypeSort = (value: string, label: string) => {
    table
      .getColumn("type")
      ?.setFilterValue(value === "Type sort by" ? "" : value);
    setTypeSort(label);
  };

  const resetFilters = () => {
    setColumnFilters([]);
    setSearchValue("");
    handleStatusSort("Status sort by", "Status sort by");
    handleTypeSort("Type sort by", "Type sort by");
  };

  const isResetVisible =
    searchValue !== "" ||
    (statusSort !== "Status sort by" && statusSort !== "") ||
    (typeSort !== "Type sort by" && typeSort !== "");

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center py-4">
        <Input
          placeholder="Search by title..."
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            table.getColumn("title")?.setFilterValue(event.target.value);
          }}
        />
        <Select
          onValueChange={(value) => {
            const label =
              value === "Published first" || value === "Draft first"
                ? value
                : "Status sort by";
            handleStatusSort(value, label);
          }}
          value={statusSort !== "" ? statusSort : "Status sort by"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Status sort by">Status sort by</SelectItem>
            <SelectItem value="Published first">Published first</SelectItem>
            <SelectItem value="Draft first">Draft first</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            const label =
              value === "Video" || value === "Text" ? value : "Type sort by";
            handleTypeSort(value, label);
          }}
          value={typeSort !== "" ? typeSort : "Type sort by"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Type sort by">Type sort by</SelectItem>
            <SelectItem value="Video">Video</SelectItem>
            <SelectItem value="Text">Text</SelectItem>
          </SelectContent>
        </Select>
        {isResetVisible && (
          <Button onClick={resetFilters} variant="outline">
            Reset
          </Button>
        )}
      </div>
      <LessonItemsButton />
    </div>
  );
}
