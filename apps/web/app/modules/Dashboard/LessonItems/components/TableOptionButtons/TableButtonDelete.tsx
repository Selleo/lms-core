import React, { useState } from "react";
import Trash from "~/assets/trash.svg?react";
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

interface DataFetch {
  id: string;
  name: string;
  displayName: string;
}

export const TableButtonDelete = ({
  id,
  setDataFetch,
}: {
  btnStyle: string;
  id: string;
  setDataFetch: React.Dispatch<React.SetStateAction<DataFetch[]>>;
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  // TODO when the backend is done, swap the handleDelete function with useDeleteLessonItem().
  const handleDelete = () => {
    setDataFetch((prev) => prev.filter((el) => el.id !== id));
    setIsDeleted(true);
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <p className="flex justify-center align-center width-border w-8 h-8 border border-red-600 p-1 rounded-md">
            <Trash className="w-5" />
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

      {isDeleted && (
        <AlertDialog open={isDeleted} onOpenChange={setIsDeleted}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deleted</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
