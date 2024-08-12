import { Link } from "@remix-run/react";
import Pencil from "~/assets/pencil.svg?react";

export const TableButtonEdit = ({
  id,
}: {
  id: string;
  description: string;
}) => {
  return (
    <Link to={`edit/${id}`} rel="noopener noreferrer" target="_blank">
      <p className="flex justify-center align-center w-8 h-8 border border-blue-500 p-1 rounded-md">
        <Pencil className="w-5" />
      </p>
    </Link>
  );
};
