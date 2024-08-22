import React from "react";
import { BasePropertyProps } from "adminjs";
// import {
//   Input,
//   xd,
// } from "../../../../../packages/ui/src/components/ui/input.js";
import { Input } from "@repo/ui";

interface CustomSelectComponentProps extends BasePropertyProps {
  onChange: (propertyOrRecord: string, value: string) => void;
}

const CustomInputComponent = (
  {
    // onChange,
    // property,
    // record,
  }: CustomSelectComponentProps,
) => {
  // const { name } = property;
  // const value = record?.params[name] || "";
  // console.log({ xd });
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");
  console.log("DUPAAAAAAAAAAA");

  return (
    <>
      {/* <Input
        onChange={(e: any) => onChange(name, e.target.value)}
        value={value}
      /> */}
      xd
      <p>DUPAAAAAAAAAAA333</p>
      {/* {xd} */}
    </>
  );
};

export default CustomInputComponent;
