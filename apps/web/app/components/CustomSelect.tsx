import React, { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "~/components/ui/select.js";

interface SelectGroupProps {
  labelValue?: string;
  selectItemList: string[];
}

interface CustomSelectProps {
  onValueChange?: (value: string) => void;
  selectItems: SelectGroupProps[];
  value: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  onValueChange,
  selectItems,
  value,
}) => {
  const renderedItems = useMemo(
    () =>
      selectItems.map(({ labelValue, selectItemList }, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {labelValue && (
            <SelectLabel key={`${groupIndex}${labelValue}`}>
              {labelValue}
            </SelectLabel>
          )}
          {selectItemList.map((itemValue, itemIndex) => (
            <SelectItem key={itemIndex} value={itemValue}>
              {itemValue}
            </SelectItem>
          ))}
        </React.Fragment>
      )),
    [selectItems]
  );
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="w-auto">{renderedItems}</SelectGroup>
      </SelectContent>
    </Select>
  );
};
