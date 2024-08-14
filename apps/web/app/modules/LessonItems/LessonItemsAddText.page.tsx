import React, { useState } from "react";
import { editLessonItemFormSchema } from "./LessonItemsForms/zodFormType";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { LessonItemForm } from "./LessonItemsForms/LessonItemForm";
import { useLessonItems } from "./LessonItemsContext";

const LessonItemsAddTextLayout = () => {
  const { setLessonItems } = useLessonItems();
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof editLessonItemFormSchema>>({
    resolver: zodResolver(editLessonItemFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
    },
  });

  const handleFileChange = (files: FileList | null) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);
  };

  const onSubmit: SubmitHandler<z.infer<typeof editLessonItemFormSchema>> = (
    data
  ) => {
    setLessonItems((prevItems) => [
      ...prevItems,
      { id: new Date().getTime().toString(), ...data },
    ]);
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
