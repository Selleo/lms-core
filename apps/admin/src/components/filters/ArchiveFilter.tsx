import React from "react";
import { FormGroup, Label, Select } from "@adminjs/design-system";
import { FilterPropertyProps } from "adminjs";

const ArchiveFilter: React.FC<FilterPropertyProps> = (props) => {
  const { onChange, property, filter } = props;

  const options = [
    { value: "false", label: "Active" },
    { value: "true", label: "Archived" },
  ];

  const handleChange = (selectedOption: any) => {
    if (selectedOption.value === "all") {
      onChange(property.path, undefined);
    } else {
      onChange(property.path, selectedOption.value === "true");
    }
  };

  const value = filter
    ? options.find((option) => option.value === String(filter))
    : options[0];

  return (
    <FormGroup>
      <Label style={{ textTransform: "capitalize" }}>{property.label}</Label>
      <Select value={value} onChange={handleChange} options={options} />
    </FormGroup>
  );
};

export default ArchiveFilter;
