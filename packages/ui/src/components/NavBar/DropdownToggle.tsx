import { ChevronDown, ChevronUp } from "lucide-react";
import { memo } from "react";

export const DropdownToggle = memo(
  ({
    isOpen,
    toggleDropdown,
  }: {
    isOpen: boolean;
    toggleDropdown: () => void;
  }) => (
    <div
      className="ml-auto flex items-center justify-center p-1 rounded-full transition-all duration-300 hover:bg-gray-300"
      onClick={(e) => {
        e.preventDefault();
        toggleDropdown();
      }}
    >
      {isOpen ? (
        <ChevronUp className="w-5 h-5 mr-5" />
      ) : (
        <ChevronDown className="w-5 h-5 mr-5" />
      )}
    </div>
  )
);
