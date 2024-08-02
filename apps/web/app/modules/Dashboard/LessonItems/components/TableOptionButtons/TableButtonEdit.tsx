import React from "react";
import { Button } from "~/components/ui/button";

export const TableButtonEdit = ({ btnStyle }: { btnStyle: string }) => {
  return <Button className={btnStyle}>edit</Button>;
};
