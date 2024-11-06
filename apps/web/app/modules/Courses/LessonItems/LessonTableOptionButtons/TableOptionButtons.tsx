import { TableButtonDelete } from "./TableButtonDelete.js";
import { TableButtonEdit } from "./TableButtonEdit.js";
import { TableButtonPreview } from "./TableButtonPreview.js";

import type React from "react";

interface DataFetch {
  id: string;
  name: string;
  displayName: string;
  description: string;
  video: File | string | null | FileList;
}

export const TableOptionButtons = ({
  setDataFetch,
  data,
  setToast,
}: {
  data: {
    id: string;
    displayName: string;
    description: string;
  };
  setDataFetch: React.Dispatch<React.SetStateAction<DataFetch[]>>;
  setToast: () => void;
}) => {
  const { displayName, description, id } = data;
  return (
    <div className="flex gap-3">
      <TableButtonPreview displayName={displayName} description={description} />
      <TableButtonEdit description={description} id={id} />
      <TableButtonDelete id={id} setToast={setToast} setDataFetch={setDataFetch} />
    </div>
  );
};
