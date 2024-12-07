import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useEffect, useState } from "react";

import { ContentTypes } from "~/modules/Admin/EditCourse/EditCourse.types";

import EmptyStateUpload from "./EmptyStateUpload";

import type React from "react";

type FileUploadProps = {
  handleFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  contentTypeToDisplay: string;
  url?: string;
};

const FileUploadInput = ({
  handleFileUpload,
  isUploading,
  contentTypeToDisplay,
  url,
}: FileUploadProps) => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const acceptedTypes =
    contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM ? ".mp4,.avi,.mov" : ".pptx,.ppt,.odp";

  useEffect(() => {
    if (url) {
      setVideoPreview(url);
    }
  }, [url]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      if (contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM) {
        const videoURL = URL.createObjectURL(uploadedFile);
        setVideoPreview(videoURL);
      }
      await handleFileUpload(uploadedFile);
    }
  };

  const docs = url
    ? [
        {
          uri: url as string,
          fileType: "pptx",
          fileName: "Presentation",
        },
      ]
    : [];

  return (
    <div className="flex  flex-col gap-y-2">
      <div className="w-3/5 h-[200px] md:h-[350px] xl:h-[500px] rounded-lg border-solid border-2 border-gray-300 flex bg-gray-100 relative cursor-pointer overflow-hidden flex-col">
        {!videoPreview && !file ? (
          <EmptyStateUpload
            acceptedTypes={acceptedTypes}
            handleFileChange={handleFileChange}
            isUploading={isUploading}
            contentTypeToDisplay={ContentTypes.VIDEO_LESSON_FORM}
          />
        ) : contentTypeToDisplay === ContentTypes.VIDEO_LESSON_FORM ? (
          <video src={videoPreview as string} controls className="w-full h-full object-cover">
            <track kind="captions" />
          </video>
        ) : (
          <div className="w-full h-full overflow-auto relative">
            <DocViewer
              documents={docs}
              pluginRenderers={DocViewerRenderers}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              config={{
                header: {
                  disableFileName: true,
                  disableHeader: true,
                },
              }}
            />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-600">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadInput;
