import React from "react";
import { TableButtonDelete } from "./TableButtonDelete";
import { TableButtonEdit } from "./TableButtonEdit";
import { TableButtonPreview } from "./TableButtonPreview";

interface DataFetch {
  id: string;
  name: string;
  displayName: string;
}
export const TableOptionButtons = ({
  setDataFetch,
  data,
  setToast,
}: {
  data: { id: string; displayName: string; description: string };
  setDataFetch: React.Dispatch<React.SetStateAction<DataFetch[]>>;
  setToast: () => void;
}) => {
  const { displayName, description, id } = data;
  return (
    <div className="flex gap-3">
      <TableButtonPreview displayName={displayName} description={description} />
      <TableButtonEdit description={description} id={id} />
      <TableButtonDelete
        id={id}
        setToast={setToast}
        setDataFetch={setDataFetch}
      />
    </div>
  );
};
