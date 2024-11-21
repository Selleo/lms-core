import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";

import { File } from "./File";
import { Question } from "./Question";
import { TextBlock } from "./TextBlock";

import type { GetLessonResponse } from "~/api/generated-api";

type LessonItem = GetLessonResponse["data"]["lessonItems"][number];

type LessonItemsSwitchProps = {
  lessonItem: LessonItem;
  questionsArray: string[];
  isSubmitted?: boolean;
  lessonType: string;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

export const LessonItem = ({
  lessonItem: { content, lessonItemId, isCompleted },
  questionsArray,
  isSubmitted,
  lessonType,
  updateLessonItemCompletion,
}: LessonItemsSwitchProps) => {
  if ("body" in content) return <TextBlock content={content} />;

  if ("questionBody" in content) {
    return (
      <Question
        lessonItemId={lessonItemId}
        isSubmitted={isSubmitted}
        content={content}
        questionsArray={questionsArray}
        lessonType={lessonType}
        isCompleted={!!isCompleted}
        updateLessonItemCompletion={updateLessonItemCompletion}
      />
    );
  }

  if ("url" in content) {
    return (
      <File
        content={content}
        lessonItemId={lessonItemId}
        isCompleted={!!isCompleted}
        updateLessonItemCompletion={updateLessonItemCompletion}
      />
    );
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
