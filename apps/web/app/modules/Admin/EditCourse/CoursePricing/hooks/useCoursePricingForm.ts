import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { courseQueryOptions } from "~/api/queries/admin/useBetaCourse";
import { queryClient } from "~/api/queryClient";

import { coursePricingFormSchema } from "../validators/coursePricingFormSchema";

import type { CoursePricingFormValues } from "../validators/coursePricingFormSchema";

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
      priceInCents: priceInCents || undefined,
      currency: currency || "",
      isFree: priceInCents === 0 ? true : false,
    },
  });
  const onSubmit = async (data: CoursePricingFormValues) => {
    updateCourse({
      data,
      courseId,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
    });
  };

  return { form, onSubmit };
};
