import { GetLessonResponse } from "~/api/generated-api";
import Files from "./Files";
import Questions from "./Questions";
import TextBlock from "./TextBlock";

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

  return <div className="h4 text-center py-8">Unknown lesson item type</div>;
}
