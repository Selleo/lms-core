import { useState } from "react";
import { videoLessonItemSchema } from "./LessonItemsForms/zodFormType";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { LessonItemForm } from "./LessonItemsForms/LessonItemForm";

const LessonItemsAddVideoLayout = () => {
  const [videoFile, setVideoFile] = useState<File | null | string>(null);

  const form = useForm<z.infer<typeof videoLessonItemSchema>>({
    resolver: zodResolver(videoLessonItemSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      video: null,
    },
  });

  const handleFileChange = (files: FileList | string) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);
  };

  const onSubmit: SubmitHandler<z.infer<typeof videoLessonItemSchema>> = (
    data,
  ) => {
    console.log(data);
  };

  return (
    <div>
      <LessonItemForm
        handleFileChange={handleFileChange}
        onSubmit={onSubmit}
        videoFile={videoFile}
        isVideoRequired={true}
        form={form}
      />
    </div>
  );
};

export default LessonItemsAddVideoLayout;
