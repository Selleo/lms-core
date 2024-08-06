import { useEffect, useMemo, useState } from "react";
import { MediaPlayer } from "@vidstack/react";

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
import { UploadFromVimeo } from "./uploadVideo/UploadFromVimeo";
import { UploadFromYouTube } from "./uploadVideo/UploadFromYouTube";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.js";
import { Button } from "~/components/ui/button.js";

interface UploadMethod {
  text: string;
  method: "sendFile" | "youtube" | "vimeo" | "";
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

  const getPrerview = () => {
    if (!videoFile) {
      return <p>No video selected</p>;
    }
    const objectUrl = URL.createObjectURL(videoFile);

    return (
      <div className="w-full" key={videoFile.name}>
        <video controls className="w-1/6">
          <source
            src={objectUrl}
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
  };

  useEffect(() => {
    console.log(uploadMethod.method);
  }, [uploadMethod]);

  console.log("#####", { preview: getPrerview() });
  return (
    <FormField
      control={control}
      name={name || "name"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col items-start pb-15 py-10 gap-20">
              {getPrerview()}
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
              {uploadMethod.method === "youtube" && (
                <Input
                  type="text"
                  placeholder="Enter YouTube URL"
                  className="mt-2"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              )}
              {uploadMethod.method === "vimeo" && (
                <Input
                  type="text"
                  placeholder="Enter Vimeo URL"
                  className="mt-2"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button>{uploadMethod.text}</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="cursor-pointer">
                  <UploadFromYouTube setUploadMethod={setUploadMethod} />
                  <UploadFile
                    field={field}
                    handleFileChange={handleFileChange}
                    setUploadMethod={setUploadMethod}
                    videoFile={videoFile}
                  />
                  <UploadFromVimeo setUploadMethod={setUploadMethod} />
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
