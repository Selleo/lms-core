import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Control } from "react-hook-form";
import { z } from "zod";
import { editLessonItemFormSchema } from "./zodFormType.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import ReactPlayer from "react-player";
import { isObject } from "lodash-es";
import { RenderDialogForm } from "./RenderDialogForm";
import { UploadMethod } from "./index.js";
import { UploadFile } from "../UploadLessonVideo/UploadFile";
import { UploadFromInternet } from "../UploadLessonVideo/UploadFromInternet";

interface LessonItemFormFileInterface {
  control: Control<z.infer<typeof editLessonItemFormSchema>>;
  name: "name" | "displayName" | "description" | "video" | "";
  videoFile: File | null;
  handleFileChange: (files: FileList | null) => void;
}

const VideoRequired = () => {
  return (
    <div className="flex items-center justify-center w-full h-full radius-l border border-dashed border-red-600 text-red-600 rounded-lg">
      Video is required
    </div>
  );
};

const VideoPlayer = ({ url }: { url: string }) => {
  return (
    <div className="w-full" key={url}>
      <ReactPlayer url={url} controls className="w-full" />
      <p className="mt-2">{url}</p>
    </div>
  );
};

const VideoFilePlayer = ({ file }: { file: File }) => {
  const videoURL = URL.createObjectURL(file);
  return (
    <div className="w-full" key={file.name}>
      <video controls className="w-full">
        <source
          src={videoURL}
          type={file.type === "video/quicktime" ? "video/mp4" : file.type}
        />
        <track
          src="./vtt/captions_en.vtt"
          kind="captions"
          srcLang="en"
          label="English captions"
        />
      </video>
      <p className="mt-2">{file.name}</p>
    </div>
  );
};

export const LessonItemFormFile = ({
  control,
  name,
  videoFile,
  handleFileChange,
}: LessonItemFormFileInterface) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>({
    text: "Upload Video",
    method: "",
  });

  const getPreview = () => {
    if (!videoFile) {
      return <VideoRequired />;
    }

    if (typeof videoFile === "string") {
      return <VideoPlayer url={videoFile} />;
    }

    if (isObject(videoFile) && videoFile instanceof File) {
      return <VideoFilePlayer file={videoFile} />;
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
              <RenderDialogForm
                uploadMethod={uploadMethod}
                videoFile={videoFile}
                setUploadMethod={setUploadMethod}
                handleFileChange={handleFileChange}
                field={field}
              />
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
