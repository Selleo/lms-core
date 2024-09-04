import React from "react";
import { FormGroup, Label, Select } from "@adminjs/design-system";
import { FilterPropertyProps } from "adminjs";

interface Option {
  value: string;
  label: string;
}

const StatusFilter: React.FC<FilterPropertyProps> = (props) => {
  const { onChange, property, filter } = props;

  const options: Option[] = [
    { value: "false", label: "No" },
    { value: "true", label: "Yes" },
    { value: "", label: "All" },
  ];

  const handleChange = (selectedOption: any) => {
    if (selectedOption.value === "") {
      onChange(property.path, undefined);
    } else {
      onChange(property.path, selectedOption.value === "true");
    }
  };

  const value =
    filter.archived !== undefined
      ? options.find((option) => option.value === String(filter.archived))
      : options[2];

  return (
    <FormGroup>
      <Label style={{ textTransform: "capitalize" }}>{property.label}</Label>
      <Select
        isClearable={false}
        onChange={handleChange}
        options={options}
        value={value}
      />
    </FormGroup>
  );
};

export default StatusFilter;
