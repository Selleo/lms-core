import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { EditFormFileInput } from "./EditFormFileInput.js";
import { EditFormTextarea } from "./EditFormTextarea.js";
import { EditFormInput } from "./EditFormInput.js";
import { editLessonItemFormSchema } from "./zodFormType.js";
import { useLessonItems } from "~/modules/Dashboard/LessonItemsContext";
import { isObject } from "lodash-es";
import { useNavigate } from "@remix-run/react";

export const EditForm = ({ editId }: { editId: string }) => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { lessonItems, setLessonItems } = useLessonItems();
  const [editForm, setEditForm] = useState({
    name: "",
    displayName: "",
    description: "",
    video: null,
  });

  useEffect(() => {
    const defaultValue = lessonItems.find((item) => item.id === editId);
    if (defaultValue) {
      setEditForm(defaultValue);
      form.reset(defaultValue);
    }
    console.log(lessonItems);
  }, [lessonItems, editId, editForm]);

  const form = useForm<z.infer<typeof editLessonItemFormSchema>>({
    resolver: zodResolver(editLessonItemFormSchema),
    defaultValues: {
      name: editForm.name,
      displayName: editForm.displayName,
      description: editForm.description,
      video: editForm.video,
    },
  });

  const handleFileChange = (files: FileList | null) => {
    if (isObject(files)) {
      setVideoFile(files[0]);
    } else setVideoFile(files);

    console.log("plik: ", files);
  };

  const onSubmit: SubmitHandler<z.infer<typeof editLessonItemFormSchema>> = (
    data
  ) => {
    if (data.video) {
      if (isObject(data.video)) {
        setVideoFile(data.video[0]);
      } else setVideoFile(data.video);
    } else {
      return console.log("video is required");
    }

    console.log("data", data);

    setLessonItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === editId) {
          return { ...item, ...data };
        }
        return item;
      });
    });
  };

  const onCancel = () => {
    form.reset(editForm);
    navigate("/dashboard/lessonItems");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto px-12 md:w-3/5 w-4/5"
      >
        <div className="grid md:grid-cols-2 gap-6 grid-cols-1">
          <div className="md:col-span-2 col-span-1">
            <EditFormFileInput
              control={form.control}
              name="video"
              videoFile={videoFile}
              handleFileChange={handleFileChange}
            />
          </div>
          <EditFormInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="Name"
          />
          <EditFormInput
            control={form.control}
            name="displayName"
            label="Display Name"
            placeholder="Display name"
          />
          <div className="md:col-span-2 col-span-1">
            <EditFormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Description"
            />
          </div>
          <div className="flex space-x-4 my-10">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Back
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
