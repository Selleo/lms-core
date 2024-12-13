import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

import type { CourseFormData, StepComponentProps } from "../types/scorm.types";

export function CourseDetailsStep({ handleBack, handleNext }: StepComponentProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext<CourseFormData>();
  const courseDescription = watch("details.description");

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-6">
        <div className="flex-1">
          <Label className="text-sm font-medium">
            <span className="text-destructive">*</span> Course Title
          </Label>
          <Input {...register("details.title")} placeholder="Enter title..." />
          {errors.details?.title && (
            <p className="text-sm text-destructive">{errors.details.title.message}</p>
          )}
        </div>

        <div className="flex-1">
          <Label className="text-sm font-medium">
            <span className="text-destructive">*</span> Category
          </Label>
          <FormField
            control={control}
            name="details.category"
            render={({ field }) => (
              <Select onValueChange={(value) => setValue("details.category", value)} {...field}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.details?.category && (
            <p className="text-sm text-destructive">{errors.details.category.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          <span className="text-destructive">*</span> Description
        </Label>
        <Textarea
          {...register("details.description")}
          placeholder="Provide description about the course..."
          className="resize-none h-40"
          maxLength={180}
        />
        <div className="flex justify-start">
          <span className="text-sm text-muted-foreground">
            {180 - (courseDescription?.length || 0)} characters left
          </span>
        </div>
        {errors.details?.description && (
          <p className="text-sm text-destructive">{errors.details.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Upload thumbnail</Label>
        <input
          type="file"
          accept=".svg,.png,.jpg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("details.thumbnail", file);
          }}
          className="hidden"
          id="thumbnail-upload"
        />
        <Label
          htmlFor="thumbnail-upload"
          className="cursor-pointer block border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors"
        >
          <div className="space-y-2">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">SVG, PNG, JPG (max. to 50MB)</p>
          </div>
        </Label>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Pricing</Button>
      </div>
    </div>
  );
}
