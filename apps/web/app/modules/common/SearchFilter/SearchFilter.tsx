import { debounce } from "lodash-es";
import { Search } from "lucide-react";
import { useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type React from "react";

export type FilterType = "text" | "select" | "state" | "status";

export type TextFilterValue = string | undefined;
export type SelectFilterValue = string | undefined;
export type StatusFilterValue = boolean | undefined;

export type FilterValue = TextFilterValue | SelectFilterValue | StatusFilterValue;

export type FilterOption = {
  value: string;
  label: string;
};

export type BaseFilterConfig = {
  name: string;
  placeholder?: string;
};

export type TextFilterConfig = BaseFilterConfig & {
  type: "text";
};

export type SelectFilterConfig = BaseFilterConfig & {
  type: "select" | "state";
  options: FilterOption[] | undefined;
};

export type StatusFilterConfig = BaseFilterConfig & {
  type: "status";
};

export type FilterConfig = TextFilterConfig | SelectFilterConfig | StatusFilterConfig;

export type FilterValues = Partial<{
  [key: string]: FilterValue;
}>;

interface SearchFilterProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (name: string, value: FilterValue) => void;
  isLoading?: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  values,
  onChange,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchTitle = debounce(onChange, 300);

  const handleChange = (name: string, value: FilterValue) => {
    if (filters.find((filter) => filter.type === "status")?.name === name) {
      onChange(name, value === "all" ? undefined : value === "archived");
    } else {
      onChange(name, value === "all" ? undefined : (value as string));
    }
  };

  const handleTextChange = (name: string, value: string) => {
    debouncedSearchTitle(name, value || undefined);
  };

  const handleClearAll = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    filters.forEach((filter) => {
      onChange(filter.name, undefined);
    });
  };

  const isAnyFilterApplied = Object.values(values).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap gap-2 items-center py-6 grow">
      {filters.map((filter) => {
        if (filter.type === "text") {
          return (
            <div key={filter.name} className="relative flex-grow max-w-2xl">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-800 w-5 h-5" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={filter.placeholder || "Search..."}
                className="pl-8 pr-4 py-2 max-w-[320px] md:max-w-none w-full border border-neutral-300"
                onChange={(e) => handleTextChange(filter.name, e.target.value)}
                defaultValue={values[filter.name] as string}
              />
            </div>
          );
        }

        if (filter.type === "select" || filter.type === "state") {
          const value = values[filter.name];
          return (
            <Select
              key={filter.name}
              value={(value as string) ?? "all"}
              onValueChange={(value) => handleChange(filter.name, value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full max-w-[320px] sm:w-[180px] border border-neutral-300">
                <SelectValue placeholder={filter.placeholder || "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.placeholder}</SelectItem>
                {filter.options?.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (filter.type === "status") {
          return (
            <Select
              key={filter.name}
              value={
                values[filter.name] === undefined
                  ? "all"
                  : values[filter.name] === true
                    ? "archived"
                    : "active"
              }
              onValueChange={(value) => handleChange(filter.name, value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full max-w-[320px] sm:w-[180px] border border-neutral-300">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          );
        }
      })}

      {isAnyFilterApplied && (
        <Button
          className="border border-primary-500 bg-transparent text-primary-700"
          onClick={handleClearAll}
          disabled={isLoading}
        >
          Clear All
        </Button>
      )}
    </div>
  );
};
