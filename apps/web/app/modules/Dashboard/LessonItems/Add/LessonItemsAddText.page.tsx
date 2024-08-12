import React, { useState } from "react";
import { useLessonItems } from "~/modules/Dashboard/LessonItemsContext";
import { DefaultValuesInterface } from "../../components/LessonItemForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { useNavigate } from "@remix-run/react";
import { LessonItemForm } from "~/components/LessonItems/LessonItemForm";
import { editLessonItemFormTextSchema } from "~/components/Form/zodFormType";

const LessonItemsAddTextLayout = () => {
  const { setLessonItems } = useLessonItems();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const lessonItemForm = {
    title: "",
    status: "",
    description: "",
  };
  const form = useForm<z.infer<typeof editLessonItemFormTextSchema>>({
    resolver: zodResolver(editLessonItemFormTextSchema),
    defaultValues: lessonItemForm,
  });

  const handleFileChange = (files: FileList | null) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);
  };

  const onSubmit: SubmitHandler<
    z.infer<typeof editLessonItemFormTextSchema>
  > = (data) => {
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

  const onCancel = () => {
    navigate("/dashboard/lessonItems");
    form.reset();
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
        onCancel={onCancel}
      />
    </div>
  );
};

export default LessonItemsAddTextLayout;
