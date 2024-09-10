import React from "react";
import { FormGroup, Label, Select } from "@adminjs/design-system";
import { FilterPropertyProps } from "adminjs";
import { statusOptions } from "../../AdminResourceOptions/common/consts/selectOptions/statusOptions.js";

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
  const isStatusSelect = propertyName === "status";

  const handleChange = (selectedOptions: Option[]) => {
    const values = selectedOptions.map((option) => option.value).join(",");
    onChange(property.path, values);
  };

  const value = filter[propertyName]
    ? customProps.availableValues.filter(
        (option: (typeof customProps.availableValues)[number]) =>
          filter[propertyName].split(",").includes(option.value),
      )
    : [isStatusSelect ? statusOptions[0] : null];

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
