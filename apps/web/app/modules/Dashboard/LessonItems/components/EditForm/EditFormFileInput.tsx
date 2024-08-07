import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Control } from "react-hook-form";
import { z } from "zod";
import { editLessonItemFormSchema } from "./zodFormType.js";
import { UploadFile, UploadFileDialog } from "./uploadVideo/UploadFile";
import {
  UploadFromInternetDialog,
  UploadFromInternet,
} from "./uploadVideo/UploadFromInternet.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.js";
import { Button } from "~/components/ui/button.js";
import ReactPlayer from "react-player";
import { isObject } from "lodash-es";

interface UploadMethod {
  text: string;
  method: "sendFile" | "internet" | "";
}

interface EditFormFileInputInterface {
  control: Control<z.infer<typeof editLessonItemFormSchema>>;
  name: "name" | "displayName" | "description" | "video" | "";
  label: string;
  videoFile: File | null;
  handleFileChange: (files: FileList | null) => void;
}

export const EditFormFileInput = ({
  control,
  name,
  label,
  videoFile,
  handleFileChange,
}: EditFormFileInputInterface) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>({
    text: "Upload Video",
    method: "",
  });

  const getPreview = () => {
    if (!videoFile) {
      return <p className="text-red-600">Video is required</p>;
    }

    if (typeof videoFile === "string") {
      return (
        <div className="w-full" key={videoFile}>
          <ReactPlayer url={videoFile} controls className="w-1/6" />
          <p className="mt-2">{videoFile}</p>
        </div>
      );
    }

    if (isObject(videoFile)) {
      const videoURL = URL.createObjectURL(videoFile);

      return (
        <div className="w-full" key={videoFile.name}>
          <video controls className="w-1/6">
            <source
              src={videoURL}
              type={
                videoFile.type === "video/quicktime"
                  ? "video/mp4"
                  : videoFile.type
              }
            />
            <track
              src="./vtt/captions_en.vtt"
              kind="captions"
              srcLang="en"
              label="English captions"
            />
          </video>
          <p className="mt-2">{videoFile.name}</p>
        </div>
      );
    }
    return <p>Unsupported video type</p>;
  };

  return (
    <FormField
      control={control}
      name={name || "name"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col items-start pb-15 py-10 gap-20">
              {getPreview()}
              {uploadMethod.method === "sendFile" && (
                <>
                  <UploadFileDialog
                    videoFile={videoFile}
                    setUploadMethod={setUploadMethod}
                    handleFileChange={handleFileChange}
                    field={field}
                  />
                </>
              )}
              {uploadMethod.method === "internet" && (
                <UploadFromInternetDialog
                  videoFile={videoFile}
                  setUploadMethod={setUploadMethod}
                  handleFileChange={handleFileChange}
                  field={field}
                />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button>Upload Video</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="cursor-pointer">
                  <UploadFromInternet setUploadMethod={setUploadMethod} />
                  <UploadFile setUploadMethod={setUploadMethod} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
