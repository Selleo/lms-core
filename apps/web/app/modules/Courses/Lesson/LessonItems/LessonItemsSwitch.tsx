import type { GetLessonResponse } from "~/api/generated-api";
import Questions from "./Questions";
import TextBlock from "./TextBlock";
import Files from "./Files";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";
import type { TQuestionsForm } from "../types";
import type { UseFormGetValues, UseFormRegister } from "react-hook-form";
import { useUserRole } from "~/hooks/useUserRole";

type TLessonItem = GetLessonResponse["data"]["lessonItems"][number];

type TProps = {
  lessonItem: TLessonItem;
  getValues: UseFormGetValues<TQuestionsForm>;
  questionsArray: string[];
  register: UseFormRegister<TQuestionsForm>;
  isSubmitted: boolean;
};

export default function LessonItemsSwitch({
  lessonItem,
  getValues,
  questionsArray,
  register,
  isSubmitted,
}: TProps) {
  const { isAdmin } = useUserRole();

  if ("body" in lessonItem.content)
    return <TextBlock content={lessonItem.content} />;

  if ("questionBody" in lessonItem.content)
    return (
      <Questions
        id={lessonItem.id}
        isSubmitted={isSubmitted}
        content={lessonItem.content}
        getValues={getValues}
        questionsArray={questionsArray}
        register={register}
        isAdmin={isAdmin}
        questionBody={lessonItem.content.questionBody}
        questionType={lessonItem.content.questionType}
      />
    );

  if ("url" in lessonItem.content)
    return (
      <Files
        content={lessonItem.content}
        lessonItemId={lessonItem.id}
        isAdmin={isAdmin}
      />
    );

  return (
    <div className="h4 text-center py-8 border-none drop-shadow-primary">
      Unknown lesson item type
    </div>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <CustomErrorBoundary stack={error.data} />;
  } else if (error instanceof Error) {
    return <CustomErrorBoundary stack={error.stack} />;
  } else {
    return <CustomErrorBoundary />;
  }
}
