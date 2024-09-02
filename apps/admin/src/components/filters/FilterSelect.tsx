import React from "react";
import { FormGroup, Label, Select } from "@adminjs/design-system";
import { FilterPropertyProps } from "adminjs";

interface Option {
  value: string;
  label: string;
}

const FilterSelect = ({
  onChange,
  property,
  filter,
  resource,
}: FilterPropertyProps) => {
  const propertyName = property.name;
  const customProps = resource.properties[propertyName].props;

  const handleChange = (selectedOptions: Option[]) => {
    const values = selectedOptions.map((option) => option.value).join(",");
    onChange(property.path, values);
  };

  const value = filter[propertyName]
    ? customProps.availableValues.filter(
        (option: (typeof customProps.availableValues)[number]) =>
          filter[propertyName].split(",").includes(option.value),
      )
    : [];

  return (
    <FormGroup>
      <Label style={{ textTransform: "capitalize" }}>{property.label}</Label>
      <Select
        isMulti
        onChange={handleChange}
        options={customProps.availableValues}
        value={value}
      />
    </FormGroup>
  );
};

export default FilterSelect;
