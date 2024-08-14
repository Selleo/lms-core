import { useParams } from "@remix-run/react";
import { isObject } from "lodash-es";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editLessonItemFormSchema } from "./LessonItemsForms/zodFormType";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLessonItems } from "./LessonItemsContext";
import { LessonItemForm } from "./LessonItemsForms/LessonItemForm";

export default function LessonItemsEditPage() {
  const { lessonItems, setLessonItems } = useLessonItems();
  const [videoFile, setVideoFile] = useState<File | null | string>(null);
  const { id } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof editLessonItemFormSchema>>({
    resolver: zodResolver(editLessonItemFormSchema),
    //TODO: ADD useLessonItem(id) when DB will be done
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      video: "null",
    },
  });
  if (!id || !lessonItems.find((item) => item.id === id)) {
    return (
      <div className="w-fit mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <div>
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>ID Not Found</AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }
  const handleFileChange = (files: FileList | null | string) => {
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
    setLessonItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, ...data };
        }
        return item;
      });
    });
  };

  return (
    <div>
      <LessonItemForm
        handleFileChange={handleFileChange}
        onSubmit={onSubmit}
        videoFile={videoFile}
        //TODO: After adding the database connection, remove the conditional operator.
        isVideoRequired={Boolean(form.formState.defaultValues?.video) || true}
        form={form}
      />
    </div>
  );
}
