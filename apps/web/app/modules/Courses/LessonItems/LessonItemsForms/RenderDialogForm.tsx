import { type ControllerRenderProps } from "react-hook-form";

import { type UploadMethod } from "./types.js";
import { UploadFileDialog } from "../UploadLessonVideo/UploadFile.js";
import { UploadFromInternetDialog } from "../UploadLessonVideo/UploadFromInternet.js";
// import { RenderDialogFormInterface } from "./types.js";RenderDialogFormInterface

interface RenderDialogFormInterface {
  field: ControllerRenderProps<
    {
      name: string;
      displayName: string;
      description: string;
      video: string | File | File[] | null;
    },
    "name" | "displayName" | "description" | "video"
  >;
  uploadMethod: UploadMethod;
  videoFile: File | null | string;
  setUploadMethod: (method: UploadMethod) => void;
  handleFileChange: (files: FileList | string) => void;
}

export const RenderDialogForm = ({
  uploadMethod,
  setUploadMethod,
  handleFileChange,
  field,
}: RenderDialogFormInterface) => {
  return (
    <div>
      {uploadMethod.method === "sendFile" && (
        <>
          <UploadFileDialog
            setUploadMethod={setUploadMethod}
            handleFileChange={handleFileChange}
            field={field}
          />
        </>
      )}
      {uploadMethod.method === "internet" && (
        <UploadFromInternetDialog
          setUploadMethod={setUploadMethod}
          handleFileChange={handleFileChange}
          field={field}
        />
      )}
    </div>
  );
};
