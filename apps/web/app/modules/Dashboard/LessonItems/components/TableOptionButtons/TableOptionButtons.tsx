import React from "react";
import { TableButtonDelete } from "./TableButtonDelete";
import { TableButtonEdit } from "./TableButtonEdit";
import { TableButtonPreview } from "./TableButtonPreview";

interface LessonItem {
  id: string;
  title: string;
  status: "Completed" | "Not Started";
  author: string;
  description: string;
  video?: File | null;
}
export const TableOptionButtons = ({
  setDataFetch,
  data,
}: {
  data: { id: string; title: string; description: string };
  setDataFetch: React.Dispatch<React.SetStateAction<LessonItem[]>>;
}) => {
  const { title, description, id } = data;
  return (
    <div className="flex gap-3">
      <TableButtonPreview title={title} description={description} />
      <TableButtonEdit description={description} id={id} />
      <TableButtonDelete id={id} setDataFetch={setDataFetch} />
    </div>
  );
};
