import React, { useState, DragEvent, useRef, useEffect } from "react";
import { FormVideoFile } from "./FormVideoFile.js";
import { UploadVideoButton } from "../uploadVideo/UploadVideoButton.js";
import { UploadMethod } from "../index.js";
import { ControllerRenderProps } from "react-hook-form";
import { useFormField } from "~/components/ui/form.js";

interface FormVideoDragAndDropProps {
  onFileSelect?: (file: File) => void;
  setUploadMethod: React.Dispatch<UploadMethod>;
  handleFileChange: (files: FileList | null) => void;
  field: ControllerRenderProps;
}

export const FormVideoDragAndDrop: React.FC<FormVideoDragAndDropProps> = ({
  setUploadMethod,
  handleFileChange,
  field,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string>("");
  const { error } = useFormField();

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoURL(url);
      handleFileChange(e.dataTransfer.files);
      field.onChange(e.dataTransfer.files);
    }
  };
  const borderColorClass = error ? "border-red-600" : "border-gray-500";
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col align-center justify-center h-full p-4 ${
        !dragActive
          ? `border-2 rounded-md border-dashed ${borderColorClass}`
          : ""
      }`}
      style={{ cursor: "pointer", textAlign: "center" }}
    >
      {videoFile ? (
        <FormVideoFile videoFile={videoFile} videoURL={videoURL} />
      ) : (
        <>
          <p>Drag & Drop your video file here</p>
          <p className="mt-4">- OR -</p>
          <div className="flex justify-center mt-4">
            <UploadVideoButton setUploadMethod={setUploadMethod} />
          </div>
        </>
      )}
    </div>
  );
};
