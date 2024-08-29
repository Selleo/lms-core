import React, { ChangeEvent } from "react";
import { BasePropertyProps } from "adminjs";
import { Input as BaseInput } from "@repo/ui";

interface SelectComponentProps extends BasePropertyProps {
  onChange: (propertyOrRecord: string, value: string) => void;
}

const Input = ({ property, record, onChange }: SelectComponentProps) => {
  const { name } = property;
  const value = record?.params[name] || "";

  return (
    <BaseInput
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange(name, e.target.value)
      }
      value={value}
    />
  );
};

export default Input;
