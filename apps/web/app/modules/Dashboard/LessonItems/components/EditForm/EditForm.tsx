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

export const EditForm = ({ editId }: { editId: string }) => {
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
  }, [lessonItems, editId]);

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
    if (files && files.length > 0) {
      console.log("jestem w handleFileChange", files[0]);
      setVideoFile(files[0]);
    }
  };

  useEffect(() => {
    if (videoFile) {
      return () => URL.revokeObjectURL(URL.createObjectURL(videoFile));
    }
  }, [videoFile]);

  const onSubmit: SubmitHandler<z.infer<typeof editLessonItemFormSchema>> = (
    data
  ) => {
    if (data.video) {
      setVideoFile(data.video[0]);
    } else {
      console.error("Data does not contain video property", data);
    }

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
    setVideoFile(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-8">
        <div className="grid grid-cols-2 gap-6">
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
        </div>
        <EditFormTextarea
          control={form.control}
          name="description"
          label="Description"
          placeholder="Description"
        />
        <EditFormFileInput
          control={form.control}
          name="video"
          label="Video"
          videoFile={videoFile}
          handleFileChange={handleFileChange}
        />
        <div className="flex space-x-4 my-10">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
