import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateCategoryBody } from "~/api/generated-api";
import { useUpdateCategory } from "~/api/mutations/admin/useUpdateCategory";
import {
  categoryByIdQueryOptions,
  useCategoryById,
} from "~/api/queries/admin/useCategoryById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";
import { CategoryInfo } from "./CategoryInfo";

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
  if (!category) throw new Error("Category not found");

  const onSubmit = (data: UpdateCategoryBody) => {
    updateCategory({ data, categoryId: id }).then(() => {
      queryClient.invalidateQueries(categoryByIdQueryOptions(id));
      setIsEditing(false);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg h-full p-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-neutral-950 font-semibold mb-4">
            Category Information
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
              <CategoryInfo
                name={field}
                control={control}
                isEditing={isEditing}
                category={category}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Category;
