import { UseFormReturn } from "react-hook-form";
import { DefaultValuesInterface } from "./index.js";
import { LMSForm } from "~/components/Form/LMSForm";
import { FormFile } from "~/components/Form/FormFile";
import { FormTextarea } from "~/components/Form/FormTextarea";
import { FormInput } from "~/components/Form/FormInput.js";
import { FormSelect } from "../Form/FormSelect.js";

interface LessonItemForm {
  lessonItemForm: DefaultValuesInterface;
  isVideoRequired: boolean;
  onSubmit: (data: any) => void;
  videoFile: File | null;
  handleFileChange: (files: FileList | null) => void;
  form: UseFormReturn<any>;
  onCancel: () => void;
}

export const LessonItemForm = ({
  isVideoRequired,
  onSubmit,
  videoFile = null,
  handleFileChange = () => {},
  form,
  onCancel,
}: LessonItemForm) => {
  return (
    <LMSForm onSubmit={onSubmit} form={form} onCancel={onCancel}>
      <>
        {isVideoRequired && (
          <div className="md:col-span-2 col-span-1">
            <FormFile
              control={form.control}
              name="video"
              videoFile={videoFile}
              handleFileChange={handleFileChange}
            />
          </div>
        )}
        <FormInput
          control={form.control}
          name="title"
          label="Title"
          placeholder="Title"
        />
        <FormSelect control={form.control} name="status" />
        {!isVideoRequired && (
          <div className="md:col-span-2 col-span-1">
            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Description"
            />
          </div>
        )}
      </>
    </LMSForm>
  );
};
