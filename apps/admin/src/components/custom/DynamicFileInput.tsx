import React, { useState, useEffect } from "react";
import { BasePropertyProps, EditPropertyProps } from "adminjs";
import { FormGroup, Label, Input } from "@adminjs/design-system";

const DynamicFileInput: React.FC<BasePropertyProps> = (props) => {
  const { onChange, property, record } = props as EditPropertyProps;
  const [inputType, setInputType] = useState<"file" | "url">("file");

  useEffect(() => {
    setInputType(record.params.type === "external_video" ? "url" : "file");
  }, [record.params.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = inputType === "url" ? e.target.value : e.target.files?.[0];
    onChange("file", value);
    onChange("url", inputType === "url" ? value : "");
  };

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      {inputType === "url" ? (
        <Input
          type="text"
          id={property.name}
          name={property.name}
          onChange={handleChange}
          value={record.params.url || ""}
          placeholder="Wklej link do zewnętrznego wideo"
        />
      ) : (
        <Input
          type="file"
          id={property.name}
          name={property.name}
          onChange={handleChange}
        />
      )}
    </FormGroup>
  );
};

export default DynamicFileInput;
