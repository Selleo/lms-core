import { useParams } from "@remix-run/react";
import { capitalize, startCase } from "lodash-es";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateCourseBody } from "~/api/generated-api";
import { useUpdateCourse } from "~/api/mutations/useUpdateCourse";
import {
  categoriesQueryOptions,
  useCategoriesSuspense,
} from "~/api/queries/useCategories";
import { courseQueryOptions, useCourseById } from "~/api/queries/useCourseById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Loader from "~/modules/common/Loader/Loader";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(categoriesQueryOptions);
  return null;
};

const displayedFields: Array<keyof UpdateCourseBody> = [
  "title",
  "description",
  "state",
  "priceInCents",
  "currency",
  "categoryId",
  "lessons",
  "archived",
];

const User = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Course ID not found");

  const { data: course, isLoading } = useCourseById(id);
  const { mutateAsync: updateCourse } = useUpdateCourse();
  const { data: categories } = useCategoriesSuspense();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateCourseBody>();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  if (!course) throw new Error("User not found");

  const onSubmit = (data: UpdateCourseBody) => {
    console.log(data);
    updateCourse({ data, courseId: id }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(id));
      setIsEditing(false);
    });
  };

  const CourseInfoItem: React.FC<{ name: keyof UpdateCourseBody }> = ({
    name,
  }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={course[name] as UpdateCourseBody[typeof name]}
      render={({ field }) => {
        if (!isEditing) {
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
              value={field.value as UpdateCourseBody["categoryId"] | undefined}
            >
              <SelectTrigger className="w-full rounded-md border border-neutral-300 px-2 py-1">
                <SelectValue
                  placeholder={capitalize(field.value as string)}
                  className="capitalize"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem value={category.id} key={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }

        if (name === "state") {
          return (
            <Select
              onValueChange={field.onChange}
              value={field.value as UpdateCourseBody["state"] | undefined}
            >
              <SelectTrigger className="w-full rounded-md border border-neutral-300 px-2 py-1">
                <SelectValue
                  placeholder={capitalize(field.value as string)}
                  className="capitalize"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["draft", "published"].map((state) => (
                    <SelectItem value={state} key={state}>
                      {capitalize(state)}
                    </SelectItem>
                  ))}
                </SelectGroup>
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
            <CourseInfoItem name={field} />
          </div>
        ))}
      </div>
    </form>
  );
};

export default User;
