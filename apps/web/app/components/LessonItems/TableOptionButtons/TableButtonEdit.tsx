import { Link } from "@remix-run/react";
import pencil from "public/pencil.svg";

export const TableButtonEdit = ({
  id,
}: {
  id: string;
  description: string;
}) => {
  return (
    <Link to={`edit/${id}`} rel="noopener noreferrer" target="_blank">
      <p className="flex justify-center align-center width-border w-8 h-8 border border-blue-500 p-1 rounded-md">
        <img className="w-5" src={pencil} alt="pencil" />
      </p>
    </Link>
  );
};
