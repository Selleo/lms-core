import { useState } from "react";
import { editLessonItemFormSchema } from "./LessonItemsForms/zodFormType";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObject } from "lodash-es";
import { LessonItemForm } from "./LessonItemsForms/LessonItemForm";
import { useLessonItems } from "./LessonItemsContext";

const LessonItemsAddVideoLayout = () => {
  const { setLessonItems } = useLessonItems();
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof editLessonItemFormSchema>>({
    resolver: zodResolver(editLessonItemFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      video: null,
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
      { id: new Date().getTime().toString(), ...data },
    ]);
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
