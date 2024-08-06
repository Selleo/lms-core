import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const TableButtonEdit = ({
  btnStyle,
  id,
}: {
  id: string;
  btnStyle: string;
  description: string;
}) => {
  return (
    <Link to={`edit/${id}`} rel="noopener noreferrer" target="_blank">
      <Button className={btnStyle}>edit</Button>
    </Link>
  );
};
