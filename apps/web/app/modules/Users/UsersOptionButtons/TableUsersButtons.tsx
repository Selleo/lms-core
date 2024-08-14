import { TableButtonDelete } from "./TableButtonArchive";
import { TableButtonEdit } from "./TableButtonEdit";

type ButtonsProps = {
  id: string;
  setToast: () => void;
};

export const TableUsersButtons: React.FC<ButtonsProps> = ({ setToast, id }) => {
  return (
    <div className="flex gap-3">
      <TableButtonEdit id={id} />
      <TableButtonDelete setToast={setToast} />
    </div>
  );
};
