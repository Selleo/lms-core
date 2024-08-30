import React, { FC } from "react";
import { BasePropertyProps } from "adminjs";

interface SelectComponentProps extends BasePropertyProps {
  onChange: (propertyName: string, value: string) => void;
}

const Select: FC<SelectComponentProps> = ({ onChange, property, record }) => {
  const { name, availableValues } = property;
  const value = record?.params[name] || "";

  return (
    <select onChange={(e) => onChange(name, e.target.value)} value={value}>
      {availableValues?.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
