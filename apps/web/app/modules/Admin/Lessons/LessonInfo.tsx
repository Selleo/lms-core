import { capitalize, startCase } from "lodash-es";
import { memo } from "react";
import { Control, Controller } from "react-hook-form";
import { GetLessonByIdResponse, UpdateLessonBody } from "~/api/generated-api";
import Editor from "~/components/RichText/Editor";
import Viewer from "~/components/RichText/Viever";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const LessonInfo = memo<{
  name: keyof UpdateLessonBody;
  control: Control<UpdateLessonBody>;
  isEditing: boolean;
  lesson: GetLessonByIdResponse["data"];
}>(({ name, control, isEditing, lesson }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={lesson[name] as UpdateLessonBody[typeof name]}
    render={({ field }) => {
      if (!isEditing) {
        if (name === "archived") {
          return (
            <span className="font-semibold capitalize">
              {lesson[name] ? "Archived" : "Active"}
            </span>
          );
        }
        if (name === "description") {
          return <Viewer content={field.value as string} style="prose" />;
        }
        return (
          <span className="font-semibold capitalize">
            {lesson[name]?.toString()}
          </span>
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
            <label
              htmlFor="archived"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Archived
            </label>
          </div>
        );
      }

      if (name === "description") {
        return (
          <Editor
            content={field.value as string}
            className="h-32 w-full"
            {...field}
          />
        );
      }

      return (
        <Input
          {...field}
          value={field.value as string}
          className="w-full rounded-md border border-neutral-300 px-2 py-1"
          placeholder={`Enter ${startCase(name)}`}
        />
      );
    }}
  />
));
