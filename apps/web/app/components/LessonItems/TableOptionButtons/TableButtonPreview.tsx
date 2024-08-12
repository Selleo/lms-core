import React from "react";
import eye from "public/eye.svg";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export const TableButtonPreview = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <p className="flex justify-center align-center width-border w-8 h-8 border border-blue-500 p-1 rounded-md">
          <img className="w-5" src={eye} alt="eye" />
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
