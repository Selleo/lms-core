import { isObject } from "lodash-es";
import { FormVideoURL } from "./FormVideoURL.js";
import { FormVideoFile } from "./FormVideoFile.js";
import { FormVideoDragAndDrop } from "./FormVideoDragAndDrop.js";
import { UploadMethod } from "../index.js";
import { ControllerRenderProps } from "react-hook-form";

export const UploadAndPreviewVideo = ({
  videoFile,
  setUploadMethod,
  handleFileChange,
  field,
}: {
  videoFile: File | null;
  setUploadMethod: React.Dispatch<UploadMethod>;
  handleFileChange: (files: FileList | null) => void;
  field: ControllerRenderProps;
}) => {
  if (!videoFile) {
    return (
      <FormVideoDragAndDrop
        handleFileChange={handleFileChange}
        setUploadMethod={setUploadMethod}
        field={field}
      />
    );
  }

  if (typeof videoFile === "string") {
    return <FormVideoURL videoFile={videoFile} />;
  }

  if (isObject(videoFile) && videoFile instanceof File) {
    const videoURL = URL.createObjectURL(videoFile);
    return <FormVideoFile videoFile={videoFile} videoURL={videoURL} />;
  }

  return <p>Unsupported video type</p>;
};
