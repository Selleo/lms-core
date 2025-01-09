import { useNavigate } from "@remix-run/react";
import { useFormContext } from "react-hook-form";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";

import type { CourseFormData, StepComponentProps } from "../types/scorm.types";
import { useTranslation } from "react-i18next";

export function ScormUploadStep({ handleNext, handleBack: _ }: StepComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CourseFormData>();

  const file = watch("scorm.file");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("scorm.file", file, {
        shouldValidate: true,
      });
      setValue("scorm.fileMetadata", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        className="hidden"
        id="scorm-upload"
      />
      <label
        htmlFor="scorm-upload"
        className="cursor-pointer block border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors"
      >
        {file ? (
          <div className="space-y-2">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium">{t("adminScorm.other.uploadFileHeader")}</p>
            <p className="text-sm text-muted-foreground">{t("adminScorm.other.uploadFileBody")}</p>
          </div>
        )}
      </label>

      {errors.scorm?.file && (
        <p className="mt-2 text-sm text-destructive">{errors.scorm.file.message}</p>
      )}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <Icon name="ArrowRight" className="w-4 h-4 mr-2 rotate-180" />
          <span>{t("common.button.cancel")}</span>
        </Button>
        <Button onClick={handleNext}>{t("adminScorm.other.setUpCourse")}</Button>
      </div>
    </div>
  );
}
