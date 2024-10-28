import { capitalize, startCase } from "lodash-es";
import { memo } from "react";
import { Control, Controller } from "react-hook-form";
import {
  GetAllCategoriesResponse,
  GetCourseByIdResponse,
  UpdateCourseBody,
} from "~/api/generated-api";
import Editor from "~/components/RichText/Editor";
import Viewer from "~/components/RichText/Viever";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const CourseInfo = memo<{
  name: keyof UpdateCourseBody;
  control: Control<UpdateCourseBody>;
  isEditing: boolean;
  course: GetCourseByIdResponse["data"];
  categories: GetAllCategoriesResponse["data"];
}>(({ name, control, isEditing, course, categories }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={course[name] as UpdateCourseBody[typeof name]}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "description") {
            return <Viewer content={field.value as string} style="prose" />;
          }
          if (name === "archived") {
            return (
              <span className="font-semibold capitalize">
                {course[name] ? "Archived" : "Active"}
              </span>
            );
          }
          if (name === "currency") {
            return (
              <span className="font-semibold uppercase">{course[name]}</span>
            );
          }
          if (name === "categoryId") {
            return (
              <span className="font-semibold uppercase">
                {course["category"]}
              </span>
            );
          }
          return (
            <span className="font-semibold capitalize">
              {course[name]?.toString()}
            </span>
          );
        }

        if (name === "categoryId") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem value={category.id} key={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (name === "state") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {["draft", "published"].map((state) => (
                  <SelectItem value={state} key={state}>
                    {capitalize(state)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (name === "archived") {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="archived"
                checked={field.value as boolean | undefined}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <Label htmlFor="archived">Archived</Label>
            </div>
          );
        }

        if (name === "description") {
          return (
            <Editor
              id="solutionExplanation"
              content={field.value as string}
              className="h-32 w-full"
              {...field}
            />
          );
        }

        return (
          <Input
            {...field}
            value={field.value as number}
            type={name === "priceInCents" ? "number" : "text"}
            placeholder={`Enter ${startCase(name)}`}
          />
        );
      }}
    />
  );
});