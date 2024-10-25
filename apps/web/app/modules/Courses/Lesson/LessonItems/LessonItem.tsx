import type { GetLessonResponse } from "~/api/generated-api";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";
import { Question } from "./Question";
import { File } from "./File";
import { TextBlock } from "./TextBlock";

type LessonItem = GetLessonResponse["data"]["lessonItems"][number];

type LessonItemsSwitchProps = {
  lessonItem: LessonItem;
  questionsArray: string[];
  isSubmitted?: boolean;
};

export const LessonItem = ({
  lessonItem: { content, lessonItemId },
  questionsArray,
  isSubmitted,
}: LessonItemsSwitchProps) => {
  if ("body" in content) return <TextBlock content={content} />;

  if ("questionBody" in content) {
    return (
      <Question
        id={lessonItemId}
        isSubmitted={isSubmitted}
        content={content}
        questionsArray={questionsArray}
      />
    );
  }

  if ("url" in content) {
    return <File content={content} lessonItemId={lessonItemId} />;
  }

  return (
    <div className="h4 text-center py-8 border-none drop-shadow-primary">
      Unknown lesson item type
    </div>
  );
};

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
