import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Column } from "@tanstack/react-table";

interface SortButtonProps<T> {
  column: Column<T, unknown>;
  children: React.ReactNode;
}

const SortButton = <T,>({ column, children }: SortButtonProps<T>) => {
  const renderSortIcon = () => {
    const sortDirection = column.getIsSorted();

    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center"
    >
      {children}
      {renderSortIcon()}
    </Button>
  );
};

export default SortButton;
