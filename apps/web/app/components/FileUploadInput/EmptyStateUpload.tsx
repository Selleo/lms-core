import { ContentTypes } from "~/modules/Admin/EditCourse/EditCourse.types";

import { Icon } from "../Icon";

import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

interface EmptyStateUploadProps {
  acceptedTypes: string;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  contentTypeToDisplay: string;
}

const contentTypeFormats = {
  [ContentTypes.VIDEO_LESSON_FORM]: "MP4, MOV, MPEG-2, or Hevc (max. 100MB)",
  [ContentTypes.PRESENTATION_FORM]: "PPT/PPTX, KEY, ODP, or PDF (max. 100MB)",
};

const EmptyStateUpload = ({
  acceptedTypes,
  handleFileChange,
  isUploading,
  contentTypeToDisplay,
}: EmptyStateUploadProps) => {
  const { t } = useTranslation();
  return (
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center h-[240px] w-full max-w-[440px] justify-center gap-y-3 bg-white border border-neutral-200 rounded-lg"
    >
      <Icon name="UploadImageIcon" className="size-10 text-primary-700" />
      <div className="flex flex-col gap-y-1 body-sm">
        <div className="text-center">
          <span className="text-primary-700">{t("uploadFile.header")}</span>{" "}
          <span className="text-neutral-950">{t("uploadFile.subHeader")}</span>
        </div>
        <div className="details text-neutral-600">{contentTypeFormats[contentTypeToDisplay]}</div>
      </div>
      <input
        type="file"
        id="file-upload"
        accept={acceptedTypes}
        onChange={handleFileChange}
        disabled={isUploading}
        className="sr-only"
      />
    </label>
  );
};

export default EmptyStateUpload;
