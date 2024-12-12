import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { useFormContext } from "react-hook-form";

import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import { StepWrapper } from "./StepWrapper";

import type { CourseFormData, StepComponentProps } from "../types/scorm.types";

export function CourseDetailsStep({ title, description }: StepComponentProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CourseFormData>();
  const courseDescription = watch("details.description");

  return (
    <div className="space-y-6">
      <StepWrapper title={title} description={description}>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Course Title <span className="text-destructive">*</span>
            </Label>
            <Input {...register("details.title")} placeholder="Enter title..." />
            {errors.details?.title && (
              <p className="text-sm text-destructive">{errors.details.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select onValueChange={(value) => setValue("details.category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
            {errors.details?.category && (
              <p className="text-sm text-destructive">{errors.details.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("details.description")}
              placeholder="Provide description about the course..."
            />
            <div className="flex justify-end">
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
            <Card className="p-6">
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
            </Card>
          </div>
        </Card>
      </StepWrapper>
    </div>
  );
}
