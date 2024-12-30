import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";

import { Question } from "./Question";
import { TextBlock } from "./TextBlock";

type LessonItemsSwitchProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lessonItem: any;
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
  // temporary solution
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ("body" in content) return <TextBlock content={content as any} />;

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

  // TODO: Remove when safe
  // if ("url" in content) {
  //   return (
  //     <File
  //       content={content}
  //       lessonItemId={lessonItemId}
  //       isCompleted={!!isCompleted}
  //       updateLessonItemCompletion={updateLessonItemCompletion}
  //     />
  //   );
  // }

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
