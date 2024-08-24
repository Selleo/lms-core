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
    { value: "false", label: "Active" },
    { value: "true", label: "Archived" },
  ];

  const handleChange = (selectedOption: any) => {
    onChange(property.path, selectedOption.value === "true");
  };

  const value = filter.status
    ? options.find((option) => option.value === String(filter.status))
    : options[0];

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
