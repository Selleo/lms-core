import React, { useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "~/modules/icons/icons";

interface SelectGroupProps {
  labelValue?: string;
  selectItemList: string[];
}

interface CustomCheckboxProps {
  onValueChange?: (value: string[]) => void;
  selectItems: SelectGroupProps[];
  value: string[];
  defaultValue: string;
}

const handleCheckboxChange = (
  itemValue: string,
  onValueChange: ((value: string[]) => void) | undefined,
  value: string[]
) => {
  let newValue;
  if (value.includes(itemValue)) {
    newValue = value.filter((v) => v !== itemValue);
  } else {
    newValue = [...value, itemValue];
  }
  if (onValueChange) {
    onValueChange(newValue);
  }
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  onValueChange,
  selectItems,
  value,
  defaultValue,
}) => {
  const renderedItems = useMemo(
    () =>
      selectItems.map(({ labelValue, selectItemList }, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {labelValue && (
            <div className="font-bold mb-2" key={`${groupIndex}${labelValue}`}>
              {labelValue}
            </div>
          )}
          {selectItemList.map((itemValue, itemIndex) => (
            <li key={itemIndex} className="flex items-center mb-2">
              <Checkbox
                checked={value.includes(itemValue)}
                onCheckedChange={() =>
                  handleCheckboxChange(itemValue, onValueChange, value)
                }
                id={`checkbox-${groupIndex}-${itemIndex}`}
              />
              <label
                htmlFor={`checkbox-${groupIndex}-${itemIndex}`}
                className="ml-2"
              >
                {itemValue}
              </label>
            </li>
          ))}
        </React.Fragment>
      )),
    [selectItems, value, onValueChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="btn">
          {value.length > 0 ? value.join(", ") : defaultValue}
          <p className="flex justify-center items-center w-7 h-full ml-2 pl-2 border-l ">
            <ChevronDownIcon className="w-4 h-4" />
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <ul>{renderedItems}</ul>
      </PopoverContent>
    </Popover>
  );
};
