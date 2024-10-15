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
import LessonAssigner from "./LessonAssigner/LessonAssigner";

// Import shadcn components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
  "archived",
];

const Course = () => {
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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  if (!course) throw new Error("Course not found");

  const onSubmit = (data: UpdateCourseBody) => {
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
            <Textarea
              {...field}
              placeholder="Enter course description"
              className="resize-none"
            />
          );
        }

        return (
          <Input
            {...field}
            type={name === "priceInCents" ? "number" : "text"}
            placeholder={`Enter ${startCase(name)}`}
          />
        );
      }}
    />
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Course Information
          </h2>
          {isEditing ? (
            <div>
              <Button type="submit" disabled={!isDirty} className="mr-2">
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
        <div className="space-y-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-1">
              <Label htmlFor={field}>
                {field === "archived" ? "Status" : startCase(field)}
              </Label>
              <CourseInfoItem name={field} />
            </div>
          ))}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Lesson Assignment
        </h3>
        <LessonAssigner
          courseId={id}
          assignedLessonIds={course.lessons.map((lesson) => lesson.id)}
        />
      </div>
    </div>
  );
};

export default Course;
