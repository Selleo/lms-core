import React, { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";

interface SelectGroupProps {
  labelValue?: string;
  selectItemList: string[];
}

interface CustomSelectCheckboxProps {
  onValueChange?: (value: string[]) => void;
  selectItems: SelectGroupProps[];
  value: string[];
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

export const CustomSelectCheckbox: React.FC<CustomSelectCheckboxProps> = ({
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
              <Checkbox
                checked={value.includes(itemValue)}
                onCheckedChange={() =>
                  handleCheckboxChange(itemValue, onValueChange, value)
                }
                id={`checkbox-${groupIndex}-${itemIndex}`}
              />
              <label htmlFor={`checkbox-${groupIndex}-${itemIndex}`}>
                {itemValue}
              </label>
            </SelectItem>
          ))}
        </React.Fragment>
      )),
    [selectItems, value, onValueChange]
  );

  return (
    <Select value={value.join(", ")} onValueChange={() => {}}>
      <SelectTrigger>
        <SelectValue>
          {value.length > 0 ? value.join(", ") : "Select..."}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="w-auto">{renderedItems}</SelectGroup>
      </SelectContent>
    </Select>
  );
};
