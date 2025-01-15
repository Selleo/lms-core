import { useTranslation } from "react-i18next";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import {
  DialogOverlay,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

type LeaveConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onValidate: () => void;
  isValidated: boolean;
};

const LeaveConfirmationModal = ({
  open,
  onClose,
  onSave,
  isValidated,
  onValidate,
}: LeaveConfirmationModalProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-primary-400 opacity-65" />
      <DialogContent className="p-12 max-w-[40%]">
        <div className="flex items-start gap-4">
          <Icon name="Warning" className="h-5 w-5 mt-0.5 text-yellow-600" />
          <div>
            <DialogTitle className="text-xl font-semibold text-neutral-900">
              {t("adminCourseView.curriculum.lesson.other.leaveContentHeader")}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-neutral-600">
              {t("adminCourseView.curriculum.lesson.other.leaveContentBody")}
            </DialogDescription>
            {!isValidated && (
              <DialogDescription className="mt-2 text-sm text-neutral-600">
                {t("adminCourseView.curriculum.lesson.other.leaveContentBodyValidate")}
              </DialogDescription>
            )}
            <div className="flex gap-4 mt-8">
              {!isValidated ? (
                <Button
                  onClick={onValidate}
                  className="text-white bg-primary-700 py-2 px-4 rounded"
                >
                  {t("common.button.validate")}
                </Button>
              ) : (
                <Button onClick={onSave} className="text-white bg-primary-700 py-2 px-4 rounded">
                  {t("common.button.save")}
                </Button>
              )}
              <Button
                onClick={onClose}
                className="text-primary-800 border border-neutral-300 bg-neutrals-200 py-2 px-4 rounded"
              >
                {t("common.button.ignore")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveConfirmationModal;
