import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import {
  DialogOverlay,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { match } from "ts-pattern";
import { DeleteContentType } from "../EditCourse/EditCourse.types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const getDialogTitleText = (): string => {
    return match(contentType)
      .with(DeleteContentType.VIDEO, () => t("deleteVideoLessonModal"))
      .with(DeleteContentType.PRESENTATION, () => t("deletePresentationLessonModal"))
      .with(DeleteContentType.TEXT, () => t("deleteTextLessonModal"))
      .with(DeleteContentType.QUIZ, () => t("deleteQuizLessonModal"))
      .with(DeleteContentType.CHAPTER, () => t("deleteChapterModal"))
      .otherwise(() => t("deleteConfirmation"));
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
              {t("deleteConfirmationModalBody")}
            </DialogDescription>
            <div className="flex gap-4 mt-8">
              <Button
                onClick={onDelete}
                className="text-white bg-error-500 hover:bg-error-600 py-2 px-4 rounded"
              >
                {t("common.button.delete")}
              </Button>
              <Button
                onClick={onClose}
                className="text-primary-800 border border-neutral-300 bg-neutrals-200 py-2 px-4 rounded"
              >
                {t("common.button.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
