import { Button } from "~/components/ui/button";
import * as React from "react";
import {
  ColumnFiltersState,
  Table as ReactTableInstance,
} from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { LessonItemsButton } from "../../LessonItemsButton";
import { CustomSelect } from "~/components/CustomSelect";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [searchValue, setSearchValue] = useState<string>("");

  const isResetVisible = useMemo(
    () =>
      !(
        searchValue === "" &&
        (statusSort === "Status sort by" || statusSort === "") &&
        (typeSort === "Type sort by" || typeSort === "")
      ),
    [searchValue, statusSort, typeSort]
  );

  const updateFilter = useCallback(
    () =>
      (
        columnId: string,
        value: string,
        defaultLabel: string,
        setSort: React.Dispatch<React.SetStateAction<string>>
      ) => {
        const label = value === defaultLabel ? "" : value;
        table.getColumn(columnId)?.setFilterValue(label);
        setSort(value);
      },
    [table]
  );

  const resetFilters = useCallback(() => {
    setColumnFilters([]);
    setSearchValue("");
    updateFilter()("status", "Status sort by", "Status sort by", setStatusSort);
    updateFilter()("type", "Type sort by", "Type sort by", setTypeSort);
  }, [setColumnFilters, setStatusSort, setTypeSort, updateFilter]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center py-4">
        <Input
          placeholder="Search by title..."
          value={searchValue}
          onChange={(event) => {
            const value = event.target.value;
            setSearchValue(value);
            table.getColumn("title")?.setFilterValue(value);
          }}
        />
        <CustomSelect
          onValueChange={(value) =>
            updateFilter()("status", value, "Status sort by", setStatusSort)
          }
          selectItems={[
            {
              selectItemList: [
                "Status sort by",
                "Published first",
                "Draft first",
              ],
            },
          ]}
          value={statusSort || "Status sort by"}
        />
        <CustomSelect
          onValueChange={(value) =>
            updateFilter()("type", value, "Type sort by", setTypeSort)
          }
          selectItems={[
            {
              selectItemList: ["Type sort by", "Video", "Text"],
            },
          ]}
          value={typeSort || "Type sort by"}
        />
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
