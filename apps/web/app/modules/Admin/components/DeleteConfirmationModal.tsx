import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import {
  DialogOverlay,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { DeleteContentType } from "../EditCourse/CourseLessons/CourseLessons.types";
import { match } from "ts-pattern";

type DeleteConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  contentType?: DeleteContentType;
};

const DeleteConfirmationModal = ({
  open,
  onClose,
  onDelete,
  contentType,
}: DeleteConfirmationModalProps) => {
  const getDialogTitleText = (): string => {
    return match(contentType)
      .with(
        DeleteContentType.Video,
        () => "Are you sure you want to delete video lesson from the chapter?",
      )
      .with(
        DeleteContentType.Presentation,
        () => "Are you sure you want to delete presentation from the chapter?",
      )
      .with(
        DeleteContentType.Text,
        () => "Are you sure you want to delete text content from the chapter?",
      )
      .with(DeleteContentType.Quiz, () => "Are you sure you want to delete quiz from the chapter?")
      .with(DeleteContentType.Chapter, () => "Are you sure you want to delete this chapter?")
      .otherwise(() => "Are you sure you want to delete this content?");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-primary-400 opacity-65" />
      <DialogContent className="p-12 max-w-[40%]">
        <div className="flex items-start gap-4">
          <Icon name="Warning" className="text-red-500 h-5 w-5 mt-0.5" />
          <div>
            <DialogTitle className="text-xl font-semibold text-neutral-900">
              {getDialogTitleText()}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-neutral-600">
              This will remove all data provided including uploaded media.
            </DialogDescription>
            <div className="flex gap-4 mt-8">
              <Button
                onClick={onDelete}
                className="text-white bg-error-500 hover:bg-error-600 py-2 px-4 rounded"
              >
                Delete
              </Button>
              <Button
                onClick={onClose}
                className="text-primary-800 border border-neutral-300 bg-neutrals-200 py-2 px-4 rounded"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
