import { useParams } from "@remix-run/react";
import { isObject } from "lodash-es";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonItemFormSchema } from "./LessonItemsForms/zodFormType";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LessonItemForm } from "./LessonItemsForms/LessonItemForm";

export default function LessonItemsEditPage() {
  const [videoFile, setVideoFile] = useState<File | null | string>(null);
  const { id } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof lessonItemFormSchema>>({
    resolver: zodResolver(lessonItemFormSchema),
    //TODO: ADD useLessonItem(id) when DB will be done
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      video: null,
    },
  });
  if (!id) {
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
  const handleFileChange = (files: FileList | string) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);
  };

  const onSubmit: SubmitHandler<z.infer<typeof lessonItemFormSchema>> = (
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
        //TODO: After adding the database connection, remove the conditional operator.
        isVideoRequired={Boolean(form.formState.defaultValues?.video) || true}
        form={form}
      />
    </div>
  );
}
