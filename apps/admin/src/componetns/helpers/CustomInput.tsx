import React from "react";
import { BasePropertyProps } from "adminjs";

import { Input } from "@repo/ui";

interface CustomSelectComponentProps extends BasePropertyProps {
  onChange: (propertyOrRecord: string, value: string) => void;
}

const CustomInputComponent = (
  {
    // property,
    // record,
    // onChange,
  }: CustomSelectComponentProps,
) => {
  // const { name } = property;
  // const value = record?.params[name] || "";

  return (
    <>
      <Input
      // onChange={(e: any) => onChange(name, e.target.value)}
      // value={value}
      />
    </>
  );
};

export default CustomInputComponent;
