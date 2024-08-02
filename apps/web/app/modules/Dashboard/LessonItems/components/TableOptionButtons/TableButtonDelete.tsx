import React from "react";
import { Button } from "~/components/ui/button";
interface DataFetch {
  id: string;
  name: string;
  displayName: string;
}
export const TableButtonDelete = ({
  btnStyle,
  id,
  setDataFetch,
}: {
  btnStyle: string;
  id: string;
  setDataFetch: React.Dispatch<React.SetStateAction<DataFetch[]>>;
}) => {
  return (
    <Button
      onClick={() => setDataFetch((prev) => prev.filter((el) => el.id !== id))}
      className={btnStyle}
    >
      delete
    </Button>
  );
};
