import React from "react";
import { TableButtonDelete } from "./TableButtonDelete";
import { TableButtonEdit } from "./TableButtonEdit";
import { TableButtonPreview } from "./TableButtonPreview";

const btnStyle =
  "bg-inherit text-black hover:bg-inherit p-0 h-auto text-small font-normal";

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
    <div className="flex gap-3">
      <TableButtonPreview displayName={displayName} description={description} />
      <TableButtonEdit description={description} id={id} />
      <TableButtonDelete
        btnStyle={btnStyle}
        id={id}
        setDataFetch={setDataFetch}
      />
    </div>
  );
};
