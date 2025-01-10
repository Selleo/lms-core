import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useUpdateCategory } from "~/api/mutations/admin/useUpdateCategory";
import { categoryByIdQueryOptions, useCategoryById } from "~/api/queries/admin/useCategoryById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";

import { CategoryDetails } from "./CategoryDetails";

import type { UpdateCategoryBody } from "~/api/generated-api";

const displayedFields: Array<keyof UpdateCategoryBody> = ["title", "archived"];

const Category = () => {
  const { id = "" } = useParams();
  const { t } = useTranslation();

  if (!id) throw new Error(t("adminCategoryView.error.categoryIdNotFound"));

  const { data: category, isLoading } = useCategoryById(id);
  const { mutateAsync: updateCategory } = useUpdateCategory();

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

  if (!category) throw new Error(t("adminCategoryView.error.categoryNotFound"));

  const onSubmit = (data: UpdateCategoryBody) => {
    updateCategory({ data, categoryId: id }).then(() => {
      queryClient.invalidateQueries(categoryByIdQueryOptions(id));
    });
  };

  const renderFields = () => {
    return displayedFields.map((field) => (
      <div key={field} className="flex flex-col gap-y-2">
        <Label className="text-neutral-600 font-normal">
          {field === "archived" ? t("adminCategoryView.field.status") : startCase(t(field))}
        </Label>
        <CategoryDetails name={field} control={control} category={category} />
      </div>
    ));
  };

  const fields = renderFields();

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-neutral-950 font-semibold mb-4">
            {t("adminCategoryView.editCategoryHeader")}
          </h2>
          <Button type="submit" disabled={!isDirty} className="mr-2">
            {t("common.button.save")}
          </Button>
        </div>
        <div className="space-y-4 pt-4">{fields}</div>
      </form>
    </div>
  );
};

export default Category;
