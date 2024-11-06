import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { LessonItemForm } from "./LessonItemsForms/LessonItemForm";
import { lessonItemFormSchema } from "./LessonItemsForms/zodFormType";

import type { z } from "zod";

const LessonItemsAddTextLayout = () => {
  const [videoFile, setVideoFile] = useState<File | null | string>(null);

  const form = useForm<z.infer<typeof lessonItemFormSchema>>({
    resolver: zodResolver(lessonItemFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
    },
  });

  const handleFileChange = (files: FileList | string) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);
  };

  const onSubmit: SubmitHandler<z.infer<typeof lessonItemFormSchema>> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <LessonItemForm
        handleFileChange={handleFileChange}
        onSubmit={onSubmit}
        videoFile={videoFile}
        isVideoRequired={false}
        form={form}
      />
    </div>
  );
};

export default LessonItemsAddTextLayout;
