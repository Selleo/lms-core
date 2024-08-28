import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { BasePropertyProps } from "adminjs";
import { Input as RepoInput } from "@repo/ui";

interface SelectComponentProps extends BasePropertyProps {
  onChange: (propertyOrRecord: string, value: string) => void;
}

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <RepoInput {...props} />;
};

const MyInput = ({ property, record, onChange }: SelectComponentProps) => {
  const { name }: { name: string } = property;
  const value: string = record?.params[name] || "";

  return (
    <Input
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange(name, e.target.value)
      }
      value={value}
    />
  );
};

export default MyInput;
