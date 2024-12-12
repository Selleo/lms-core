import { useFormContext } from "react-hook-form";

import { Card } from "~/components/ui/card";

import { StepWrapper } from "./StepWrapper";

import type { CourseFormData, StepComponentProps } from "../types/scorm.types";

export function ScormUploadStep({ title, description }: StepComponentProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CourseFormData>();
  const file = watch("scorm.file");
  const fileMetadata = watch("scorm.fileMetadata");

  const needsReupload = !file && fileMetadata;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("scorm.file", file, {
        shouldValidate: true,
      });
      setValue("scorm.fileMetadata", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  return (
    <div className="space-y-6">
      {needsReupload && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Please re-upload your file</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Previous file: {fileMetadata.name}</p>
                <p>Size: {(fileMetadata.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <StepWrapper title={title} description={description}>
        <Card className="p-6">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
            id="scorm-upload"
          />
          <label
            htmlFor="scorm-upload"
            className="cursor-pointer block border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors"
          >
            {file ? (
              <div className="space-y-2">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">SCORM .zip file (max. to 500MB)</p>
              </div>
            )}
          </label>

          {errors.scorm?.file && (
            <p className="mt-2 text-sm text-destructive">{errors.scorm.file.message}</p>
          )}
        </Card>
      </StepWrapper>
    </div>
  );
}
