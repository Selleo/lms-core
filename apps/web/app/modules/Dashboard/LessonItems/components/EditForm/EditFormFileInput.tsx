import { useMemo } from "react";
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

interface EditFormFileInputInterface {
  control: Control<z.infer<typeof editLessonItemFormSchema>>;
  name: "name" | "displayName" | "description" | "video";
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
  const videoPreview = useMemo(
    () =>
      videoFile ? (
        <div className="w-full">
          <video controls className="w-1/6">
            <source
              src={URL.createObjectURL(videoFile)}
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
      ) : (
        <p>No video selected</p>
      ),
    [videoFile]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center">
              {videoPreview}
              <Input
                type="file"
                accept="video/*"
                className="cursor-pointer mt-2"
                onChange={(e) => {
                  field.onChange(e.target.files);
                  handleFileChange(e.target.files);
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
