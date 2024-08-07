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
  videoFile: File | null;
  handleFileChange: (files: FileList | null) => void;
}

export const EditFormFileInput = ({
  control,
  name,
  videoFile,
  handleFileChange,
}: EditFormFileInputInterface) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>({
    text: "Upload Video",
    method: "",
  });

  const getPreview = () => {
    if (!videoFile) {
      return (
        <div className="flex items-center justify-center w-full h-full radius-l border border-dashed border-red-600 text-red-600 rounded-lg">
          Video is required
        </div>
      );
    }

    if (typeof videoFile === "string") {
      return (
        <div className="w-full" key={videoFile}>
          <ReactPlayer url={videoFile} controls className="w-full" />
          <p className="mt-2">{videoFile}</p>
        </div>
      );
    }

    if (isObject(videoFile)) {
      const videoURL = URL.createObjectURL(videoFile);

      return (
        <div className="w-full" key={videoFile.name}>
          <video controls className="w-full">
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
          <FormControl>
            <div className="md:flex md:items-center	md:justify-between justify-center items-start md:pb-5">
              <div className="aspect-video md:w-3/5 w-full">{getPreview()}</div>
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
              <div className="flex md:tems-center justify-center my-5 md:w-2/5 w-full items-start">
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
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
