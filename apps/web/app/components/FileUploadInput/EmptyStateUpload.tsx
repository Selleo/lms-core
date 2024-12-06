import { cn } from "~/lib/utils";
import { ContentTypes } from "~/modules/Admin/EditCourse/EditCourse.types";

import { Icon } from "../Icon";

import type React from "react";

interface EmptyStateUploadProps {
  acceptedTypes: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  contentTypeToDisplay: string;
}

const EmptyStateUpload = ({
  acceptedTypes,
  handleFileChange,
  isUploading,
  contentTypeToDisplay,
}: EmptyStateUploadProps) => {
  return (
    <>
      <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-center")}>
        <Icon name="UploadImageIcon" />
        <div className="flex items-center justify-center mt-2">
          <span className={`text-lg font-semibold text-[#7CA3DE]`}>Click to upload</span>
          <span className="ml-2 text-lg font-semibold">or drag and drop</span>
        </div>
        <div className="text-sm w-full px-2 mt-2 text-gray-600">
          Supported formats:{" "}
          {contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM
            ? "MP4, AVI, MOV"
            : "PPTX, PPT, ODP"}
        </div>
      </div>
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </>
  );
};

export default EmptyStateUpload;
