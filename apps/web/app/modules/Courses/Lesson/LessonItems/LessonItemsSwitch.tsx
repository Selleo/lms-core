import { GetLessonResponse } from "~/api/generated-api";
import Questions from "./Questions";
import TextBlock from "./TextBlock";
import Files from "./Files";
import type { UseFormRegister } from "react-hook-form";
import type { TQuestionsForm } from "../types";

type LessonItemType = GetLessonResponse["data"]["lessonItems"][number];

type TProps = {
  lessonItem: LessonItemType;
  questionsArray: string[];
  register: UseFormRegister<TQuestionsForm>;
};
export default function LessonItemsSwitch({
  lessonItem,
  questionsArray,
  register,
}: TProps) {
  if ("body" in lessonItem.content)
    return <TextBlock content={lessonItem.content} />;

  if ("questionBody" in lessonItem.content)
    return (
      <Questions
        content={lessonItem.content}
        questionsArray={questionsArray}
        register={register}
      />
    );

  if ("url" in lessonItem.content)
    return <Files content={lessonItem.content} />;

  return <div className="h4 text-center py-8">Unknown lesson item type</div>;
}
