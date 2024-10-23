import { memo } from "react";
import { Control, Controller } from "react-hook-form";
import {
  GetCategoryByIdResponse,
  UpdateCategoryBody,
} from "~/api/generated-api";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

export const CategoryInfo = memo<{
  name: keyof UpdateCategoryBody;
  control: Control<UpdateCategoryBody>;
  isEditing: boolean;
  category: GetCategoryByIdResponse["data"];
}>(({ name, control, isEditing, category }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={category[name] as UpdateCategoryBody[typeof name]}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "archived") {
            return (
              <span className="font-semibold capitalize">
                {category[name] ? "Archived" : "Active"}
              </span>
            );
          }
          return (
            <span className="font-semibold capitalize">
              {category[name]?.toString()}
            </span>
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

        return (
          <Input
            {...field}
            value={field.value as string}
            onChange={(e) => {
              field.onChange(e);
            }}
            className="w-full rounded-md border border-neutral-300 px-2 py-1"
          />
        );
      }}
    />
  );
});
