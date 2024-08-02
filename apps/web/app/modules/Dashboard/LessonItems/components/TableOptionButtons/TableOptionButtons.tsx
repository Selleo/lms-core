import React from "react";
import { TableButtonDelete } from "./TableButtonDelete";
import { TableButtonEdit } from "./TableButtonEdit";
import { TableButtonPreview } from "./TableButtonPreview";

const btnStyle =
  "bg-inherit text-black hover:bg-inherit px-0 text-small font-normal";
interface DataFetch {
  id: string;
  name: string;
  displayName: string;
}
export const TableOptionButtons = ({
  setDataFetch,
  data,
}: {
  data: { id: string; displayName: string; description: string };
  setDataFetch: React.Dispatch<React.SetStateAction<DataFetch[]>>;
}) => {
  const { displayName, description, id } = data;
  return (
    <>
      <TableButtonPreview
        displayName={displayName}
        description={description}
        btnStyle={btnStyle}
      />{" "}
      /&nbsp;
      <TableButtonEdit btnStyle={btnStyle} /> /&nbsp;
      <TableButtonDelete
        id={id}
        setDataFetch={setDataFetch}
        btnStyle={btnStyle}
      />
    </>
  );
};
