import React from "react";
import { BasePropertyProps } from "adminjs";
import { Input } from "@repo/ui";

interface SelectComponentProps extends BasePropertyProps {
  onChange: (propertyOrRecord: string, value: string) => void;
}

const MyInput = ({ property, record, onChange }: SelectComponentProps) => {
  const { name } = property;
  const value = record?.params[name] || "";

  return (
    <>
      <Input
        onChange={(e: any) => onChange(name, e.target.value)}
        value={value}
      />
    </>
  );
};

export default MyInput;
