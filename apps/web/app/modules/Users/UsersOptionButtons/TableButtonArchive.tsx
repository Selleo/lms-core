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
import { ArchiveIcon } from "~/modules/icons/icons";

export const TableButtonDelete = ({ setToast }: { setToast: () => void }) => {
  //TODO: when the backend is done, it will be necessary to add the useArchiveUser() function.
  const handleArchive = () => {
    setToast();
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <p className="flex justify-center align-center w-8 h-8 border border-red-600 p-1 rounded-md">
            <ArchiveIcon className="w-5 stroke-red-600 fill-none" />
          </p>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleArchive}>
              Archive
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
