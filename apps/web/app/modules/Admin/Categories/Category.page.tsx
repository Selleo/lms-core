import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateCategoryBody } from "~/api/generated-api";
import { useUpdateCategory } from "~/api/mutations/admin/useUpdateCategory";
import { categoriesQueryOptions } from "~/api/queries";
import { useCategoryById } from "~/api/queries/admin/useCategoryById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";

const displayedFields: Array<keyof UpdateCategoryBody> = ["title", "archived"];

const Category = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Category ID not found");

  const { data: category, isLoading } = useCategoryById(id);
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateCategoryBody>();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  if (!category) throw new Error("User not found");

  const onSubmit = (data: UpdateCategoryBody) => {
    updateCategory({ data, categoryId: id }).then(() => {
      queryClient.invalidateQueries(categoriesQueryOptions);
      setIsEditing(false);
    });
  };

  const UserInfoItem: React.FC<{ name: keyof UpdateCategoryBody }> = ({
    name,
  }) => (
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
            className="w-full rounded-md border border-neutral-300 px-2 py-1"
          />
        );
      }}
    />
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg h-full p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-neutral-950 font-semibold mb-4">
          User Information
        </h2>
        {isEditing ? (
          <div>
            <Button type="submit" disabled={!isDirty} className="mr-2">
              Save
            </Button>
            <Button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-4 pt-4">
        {displayedFields.map((field) => (
          <div key={field} className="flex flex-col gap-y-2">
            <Label className="text-neutral-600 font-normal">
              {field === "archived" ? "Status" : startCase(field)}
            </Label>
            <UserInfoItem name={field} />
          </div>
        ))}
      </div>
    </form>
  );
};

export default Category;
