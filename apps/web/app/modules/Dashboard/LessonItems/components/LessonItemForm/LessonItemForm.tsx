import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { LessonItemFormFile } from "./LessonItemFormFile.js";
import { LessonItemFormTextarea } from "./LessonItemFormTextarea.js";
import { LessonItemFormInput } from "./LessonItemFormInput.js";
import { editLessonItemFormSchema } from "./zodFormType.js";
import { useNavigate } from "@remix-run/react";
import { DefaultValuesInterface } from "./index.js";
import { LessonItemFormDropDown } from "./LessonItemFormDropDown.js";

interface LessonItemForm {
  lessonItemForm: DefaultValuesInterface;
  isVideoRequired: boolean;
  onSubmit: (data: z.infer<typeof editLessonItemFormSchema>) => void;
  videoFile: File | null;
  handleFileChange: (files: FileList | null) => void;
  form: UseFormReturn<z.infer<typeof editLessonItemFormSchema>>;
}

export const LessonItemForm = ({
  lessonItemForm,
  isVideoRequired,
  onSubmit,
  videoFile = null,
  handleFileChange = () => {},
  form,
}: LessonItemForm) => {
  const navigate = useNavigate();

  const onCancel = () => {
    form.reset(lessonItemForm);
    navigate("/dashboard/lessonItems");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          onSubmit(data);
        })}
        className="mx-auto px-12 md:w-3/5 w-4/5"
      >
        <div className="grid md:grid-cols-2 gap-6 grid-cols-1 items-end">
          {isVideoRequired && (
            <div className="md:col-span-2 col-span-1">
              <LessonItemFormFile
                control={form.control}
                name="video"
                videoFile={videoFile}
                handleFileChange={handleFileChange}
              />
            </div>
          )}
          <LessonItemFormInput
            control={form.control}
            name="title"
            label="Title"
            placeholder="Title"
          />
          <LessonItemFormDropDown control={form.control} name="status" />
          {!isVideoRequired && (
            <div className="md:col-span-2 col-span-1">
              <LessonItemFormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Description"
              />
            </div>
          )}
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
