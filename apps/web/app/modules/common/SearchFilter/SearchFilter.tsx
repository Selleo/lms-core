import { debounce } from "lodash-es";
import { Search } from "lucide-react";
import React, { useRef } from "react";
import { GetAllCategoriesResponse } from "~/api/generated-api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SORT_OPTIONS, SortOption } from "~/types/sorting";

type SearchFilterProps = {
  searchValue: string | undefined;
  sortValue: SortOption | undefined;
  categoryValue: string | undefined;
  onSearchTitleChange: (title: string | undefined) => void;
  onSortChange: (sort: SortOption | undefined) => void;
  onCategoryChange: (category: string | undefined) => void;
  categories: GetAllCategoriesResponse["data"];
  isLoading: boolean;
};

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchTitleChange,
  onSortChange,
  onCategoryChange,
  categories,
  searchValue,
  sortValue,
  categoryValue,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTitle = debounce(onSearchTitleChange, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    debouncedSearchTitle(newValue);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === "all" ? undefined : value);
  };

  const handleSortChange = (value: string) => {
    onSortChange(value === "default" ? undefined : (value as SortOption));
  };

  const handleClearAll = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onSearchTitleChange("");
    onCategoryChange("");
    onSortChange("");
  };

  const isAnyFilterApplied = !!searchValue || !!categoryValue || !!sortValue;

  return (
    <div className="flex flex-wrap gap-2 items-center py-6">
      <div className="relative flex-grow max-w-2xl">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-800 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by name or keyword..."
          className="pl-8 pr-4 py-2 w-full border border-neutral-300"
          onChange={handleSearchChange}
        />
      </div>

      <Select
        value={categoryValue ?? "all"}
        onValueChange={handleCategoryChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px] border border-neutral-300">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"all"}>All Categories</SelectItem>
          {categories.map(({ title, id }) => (
            <SelectItem key={id} value={title}>
              {title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortValue}
        onValueChange={handleSortChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px] border border-neutral-300">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

export default SearchFilter;
