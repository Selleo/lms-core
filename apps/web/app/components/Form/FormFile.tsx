import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Control } from "react-hook-form";
import { z } from "zod";
import { editFormSchema } from "./zodFormType.js";
import { RenderDialogForUploadVideo } from "./uploadVideo/RenderDialogForUploadVideo.js";
import { UploadMethod } from "./index.js";
import { UploadAndPreviewVideo } from "./uploadAndPreviewVideo/UploadAndPreviewVideo.js";
import { UploadVideoButton } from "./uploadVideo/UploadVideoButton.js";

interface FormFileInterface {
  control: Control<z.infer<typeof editFormSchema>>;
  name: "title" | "status" | "description" | "video" | "";
  videoFile: File | null;
  handleFileChange: (files: FileList | null) => void;
}

export const FormFile = ({
  control,
  name,
  videoFile,
  handleFileChange,
}: FormFileInterface) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>({
    text: "Upload Video",
    method: "",
  });
  return (
    <FormField
      control={control}
      name={name || "name"}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="md:flex md:items-center	md:justify-between justify-center items-start md:pb-5">
              <div className="aspect-video md:w-3/5 w-full">
                <UploadAndPreviewVideo
                  setUploadMethod={setUploadMethod}
                  videoFile={videoFile}
                  handleFileChange={handleFileChange}
                  field={field}
                />
              </div>
              <RenderDialogForUploadVideo
                uploadMethod={uploadMethod}
                setUploadMethod={setUploadMethod}
                handleFileChange={handleFileChange}
                field={field}
              />

              <div className="flex md:tems-center justify-center my-5 md:w-2/5 w-full items-start">
                {videoFile && (
                  <UploadVideoButton setUploadMethod={setUploadMethod} />
                )}
              </div>
            </div>
          </FormControl>
          <div className="min-h-5">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
