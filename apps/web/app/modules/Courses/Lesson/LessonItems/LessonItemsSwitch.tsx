import { GetLessonResponse } from "~/api/generated-api";
import Questions from "./Questions";
import TextBlock from "./TextBlock";
import Files from "./Files";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";

type LessonItemType = GetLessonResponse["data"]["lessonItems"][number];

type TProps = {
  lessonItem: LessonItemType;
  questionsArray: string[];
};

export default function LessonItemsSwitch({
  lessonItem,
  questionsArray,
}: TProps) {
  if ("body" in lessonItem.content)
    return <TextBlock content={lessonItem.content} />;

  if ("questionBody" in lessonItem.content)
    return (
      <Questions content={lessonItem.content} questionsArray={questionsArray} />
    );

  if ("url" in lessonItem.content)
    return <Files content={lessonItem.content} />;

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
