import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { TrashIcon } from "~/modules/icons/icons";

interface DataFetch {
  id: string;
  name: string;
  displayName: string;
}

export const TableButtonDelete = ({
  id,
  setDataFetch,
  setToast,
}: {
  id: string;
  setDataFetch: React.Dispatch<React.SetStateAction<DataFetch[]>>;
  setToast: () => void;
}) => {
  //TODO: when the backend is done, swap the handleDelete function with useDeleteLessonItem().
  const handleDelete = () => {
    setDataFetch((prev) => prev.filter((el) => el.id !== id));
    setToast();
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <p className="flex justify-center align-center width-border w-8 h-8 border border-red-600 p-1 rounded-md">
            <TrashIcon className="w-5 stroke-red-600 fill-none" />
          </p>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
