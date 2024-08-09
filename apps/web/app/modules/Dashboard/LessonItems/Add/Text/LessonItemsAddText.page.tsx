import React, { useState } from "react";
import { useLessonItems } from "~/modules/Dashboard/LessonItemsContext";
import { DefaultValuesInterface } from "../../components/LessonItemForm";
import { editLessonItemFormSchema } from "../../components/LessonItemForm/zodFormType";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { LessonItemForm } from "../../components/LessonItemForm/LessonItemForm";

const LessonItemsAddTextLayout = () => {
  const { setLessonItems } = useLessonItems();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [lessonItemForm, setLessonItemForm] = useState<DefaultValuesInterface>({
    title: "",
    status: "",
    description: "",
  });

  const form = useForm<z.infer<typeof editLessonItemFormSchema>>({
    resolver: zodResolver(editLessonItemFormSchema),
    defaultValues: lessonItemForm,
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
      {
        id: new Date().getTime().toString(),
        type: "Text",
        author: "admin",
        ...data,
      },
    ]);
  };

  return (
    <div>
      <LessonItemForm
        handleFileChange={handleFileChange}
        onSubmit={onSubmit}
        lessonItemForm={lessonItemForm}
        videoFile={videoFile}
        isVideoRequired={false}
        form={form}
      />
    </div>
  );
};

export default LessonItemsAddTextLayout;
