import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import trash from "public/trash.svg";
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

interface LessonItem {
  id: string;
  title: string;
  status: "Completed" | "Not Started";
  author: string;
  description: string;
  video?: File | null;
}

export const TableButtonDelete = ({
  id,
  setDataFetch,
}: {
  id: string;
  setDataFetch: React.Dispatch<React.SetStateAction<LessonItem[]>>;
}) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    setDataFetch((prev) => prev.filter((el) => el.id !== id));
    setIsDeleted(true);
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <p className="flex justify-center align-center width-border w-8 h-8 border border-red-600 p-1 rounded-md">
            <img className="w-5" src={trash} alt="trash" />
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
