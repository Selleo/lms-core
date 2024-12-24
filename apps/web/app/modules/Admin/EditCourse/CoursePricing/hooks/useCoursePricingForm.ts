import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { courseQueryOptions } from "~/api/queries/admin/useCourseById";
import { queryClient } from "~/api/queryClient";

import { coursePricingFormSchema } from "../validators/coursePricingFormSchema";

import type { CoursePricingFormValues } from "../validators/coursePricingFormSchema";
import type { UpdateCourseBody } from "~/api/generated-api";

type UseCoursePricingFormProps = {
  courseId: string;
  priceInCents?: number;
  currency?: string;
};

export const useCoursePricingForm = ({
  courseId,
  priceInCents,
  currency,
}: UseCoursePricingFormProps) => {
  const { mutateAsync: updateCourse } = useUpdateCourse();
  const form = useForm<CoursePricingFormValues>({
    resolver: zodResolver(coursePricingFormSchema),
    defaultValues: {
      priceInCents: priceInCents || 0,
      currency: currency || "",
      isFree: priceInCents === 0 ? true : false,
    },
  });
  const onSubmit = async (data: CoursePricingFormValues) => {
    const { isFree, ...updatedData } = data;

    updateCourse({
      data: updatedData,
      courseId,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
    });
  };

  return { form, onSubmit };
};
