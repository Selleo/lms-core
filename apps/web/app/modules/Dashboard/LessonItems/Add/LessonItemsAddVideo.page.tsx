import { useState } from "react";
import { useLessonItems } from "~/modules/Dashboard/LessonItemsContext";
import { DefaultValuesInterface } from "../../components/LessonItemForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { useNavigate } from "@remix-run/react";
import { LessonItemForm } from "~/components/LessonItems/LessonItemForm";
import { editLessonItemFormVideoSchema } from "~/components/Form/zodFormType";

const LessonItemsAddVideoLayout = () => {
  const navigate = useNavigate();
  const { setLessonItems } = useLessonItems();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const lessonItemForm = {
    title: "",
    status: "",
    description: "",
    video: null,
  };

  const onCancel = () => {
    form.reset();
    navigate("/dashboard/lessonItems");
  };

  const form = useForm<z.infer<typeof editLessonItemFormVideoSchema>>({
    resolver: zodResolver(editLessonItemFormVideoSchema),
    defaultValues: lessonItemForm,
  });

  const handleFileChange = (files: FileList | null) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);
  };

  const onSubmit: SubmitHandler<
    z.infer<typeof editLessonItemFormVideoSchema>
  > = (data) => {
    if (data.video) {
      if (data.video instanceof FileList) {
        setVideoFile(data.video[0]);
      } else {
        setVideoFile(data.video);
      }
    } else {
      console.log("video is required");
    }

    setLessonItems((prevItems) => [
      ...prevItems,
      {
        id: new Date().getTime().toString(),
        type: "Video",
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
        isVideoRequired={true}
        form={form}
        onCancel={onCancel}
      />
    </div>
  );
};

export default LessonItemsAddVideoLayout;
