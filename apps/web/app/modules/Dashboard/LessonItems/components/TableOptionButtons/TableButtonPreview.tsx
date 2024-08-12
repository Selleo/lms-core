import Eye from "~/assets/eye.svg?react";
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
  displayName,
  description,
}: {
  displayName: string;
  description: string;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <p className="flex justify-center align-center width-border w-8 h-8 border border-blue-500 p-1 rounded-md">
          <Eye className="w-5" />
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{displayName}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
