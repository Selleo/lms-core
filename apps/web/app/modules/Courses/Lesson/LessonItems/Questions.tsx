import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { getQuestionDefaultValue } from "./utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useCompletedLessonItemsStore } from "./LessonItemStore";
import { useParams } from "@remix-run/react";
import { useQuestionQuery } from "./useQuestionQuery";
import { useEffect, useState } from "react";
import type { TQuestionsForm } from "../types";
import type { UseFormGetValues, UseFormRegister } from "react-hook-form";
import { Icon } from "~/components/Icon";
import type { GetLessonResponse } from "~/api/generated-api";
import { cx } from "class-variance-authority";
import { FillTheBlanks } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/FillInTheBlanks";

type TProps = {
  id: string;
  questionType: string;
  questionBody: string;
  content: GetLessonResponse["data"]["lessonItems"][number]["content"];
  getValues: UseFormGetValues<TQuestionsForm>;
  questionsArray: string[];
  register: UseFormRegister<TQuestionsForm>;
  isAdmin: boolean;
  isSubmitted: boolean;
};

const classesMap = {
  default: "border-primary-200",
  checked: "bg-primary-50 border-primary-500",
  correctAnswerSelected: "border-success-700 bg-success-50",
  correctAnswerUnselected: "border-warning-700 bg-warning-50",
  incorrectAnswerSelected: "border-error-700 bg-error-50",
};

export default function Questions({
  isSubmitted,
  content,
  getValues,
  questionsArray,
  register,
  isAdmin,
}: TProps) {
  const { lessonId } = useParams();

  if (!lessonId) throw new Error("Lesson ID not found");

  const { markLessonItemAsCompleted } = useCompletedLessonItemsStore();
  const questionId = content.id;
  const isSingleQuestion =
    "questionType" in content && content.questionType === "single_choice";
  const isOpenAnswer =
    "questionType" in content && content.questionType === "open_answer";
  const isFillInTheBlanks = content.questionType === "fill_in_the_blanks";

  const { sendAnswer, sendOpenAnswer } = useQuestionQuery({
    lessonId,
    questionId,
  });

  const [selectedOption, setSelectedOption] = useState<string[]>(() =>
    getQuestionDefaultValue({ getValues, questionId, isSingleQuestion }),
  );

  useEffect(() => {
    if (!isSubmitted) {
      setSelectedOption([]);
    }
  }, [isSubmitted]);

  const handleClick = async (id: string) => {
    await markLessonItemAsCompleted({ lessonItemId: questionId, lessonId });

    if (isSingleQuestion) {
      setSelectedOption([id]);
      await sendAnswer([id]);
    } else {
      let newSelectedOptions: string[];
      if (selectedOption.includes(id)) {
        newSelectedOptions = selectedOption.filter((option) => option !== id);
      } else {
        newSelectedOptions = [...selectedOption, id];
      }
      setSelectedOption(newSelectedOptions);
      await sendAnswer(newSelectedOptions);
    }
  };

  const handleOpenAnswerRequest = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    await markLessonItemAsCompleted({
      lessonItemId: questionId,
      lessonId,
    });
    await sendOpenAnswer(e.target.value);
  };

  const canRenderCorrectAnswers =
    "questionAnswers" in content
      ? content.questionAnswers.some(
          (answer) =>
            (answer.isCorrect && !answer.isStudentAnswer) ||
            (!answer.isCorrect &&
              answer.isStudentAnswer &&
              answer.isCorrect !== null),
        )
      : false;

    if (isFillInTheBlanks) {
        return (
            <FillTheBlanks
                content={content.questionBody}
                sendAnswer={sendAnswer}
                answers={content.questionAnswers}
                register={register}
                questionId={questionId}
            />
        );
    }

  return (
    <Card className="flex flex-col gap-2 p-8 border-none drop-shadow-primary">
      <div className="details text-primary-700 uppercase">{`question ${questionsArray.indexOf(questionId) + 1}`}</div>
      <div className="h6 text-neutral-950">
        {"questionBody" in content ? (
          <div dangerouslySetInnerHTML={{ __html: content.questionBody }} />
        ) : (
          <div>{content.title}</div> // Fall back to the title field if questionBody doesn't exist
        )}
      </div>
      <div className="body-base-md text-neutral-900">
        {isOpenAnswer
          ? `Instruction: Provide a brief response.`
          : `Type: ${isSingleQuestion ? "Single" : "Multiple"} select question.`}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {isOpenAnswer ? (
          <Textarea
            {...register(`openQuestions.${questionId}`)}
            {...(!isAdmin && { onBlur: handleOpenAnswerRequest })}
            placeholder="Type your answer here"
            rows={5}
            className={cn({
              "cursor-not-allowed": isAdmin,
            })}
          />
        ) : (
          <>
            {"questionAnswers" in content
              ? content.questionAnswers.map((answer) => {
                  const isFieldDisabled =
                    isAdmin || typeof answer?.isCorrect === "boolean";

                  const isCorrectAnswer =
                    answer.isCorrect && answer.isStudentAnswer;

                  const isWrongAnswer =
                    !answer.isCorrect && answer.isStudentAnswer;

                  const isCorrectAnswerNotSelected =
                    answer.isCorrect && !answer.isStudentAnswer;

                  const isAnswerChecked =
                    selectedOption.includes(answer.id) &&
                    answer.isCorrect === null;

                  const getAnswerClasses = () => {
                    if (isAnswerChecked) return classesMap.checked;

                    if (answer.isCorrect === null) return classesMap.default;

                    if (isCorrectAnswer) {
                      return classesMap.correctAnswerSelected;
                    }

                    if (isCorrectAnswerNotSelected) {
                      return classesMap.correctAnswerUnselected;
                    }

                    if (isWrongAnswer) {
                      return classesMap.incorrectAnswerSelected;
                    }

                    return classesMap.default;
                  };

                  const classes = getAnswerClasses();

                  return (
                    <button
                      {...(!isFieldDisabled && {
                        onClick: () => handleClick(answer.id),
                      })}
                      key={answer.id}
                      className={cn(
                        "flex items-center space-x-3 border border-primary-200 rounded-lg py-3 px-4",
                        { "cursor-not-allowed": isFieldDisabled },
                        classes,
                      )}
                    >
                      {isSingleQuestion ? (
                        <label htmlFor={answer.id}>
                          <Input
                            className={cn("w-4 h-4", {
                              "not-sr-only": !isSubmitted,
                              "sr-only":
                                (isSubmitted &&
                                  answer.isStudentAnswer &&
                                  isWrongAnswer) ||
                                isCorrectAnswer,
                            })}
                            checked={selectedOption.includes(answer.id)}
                            id={answer.id}
                            readOnly
                            type="radio"
                            value={answer.id}
                            {...register(
                              `singleAnswerQuestions.${questionId}.${answer.id}`,
                            )}
                          />
                          <Icon
                            name={
                              isCorrectAnswer
                                ? "InputRoundedMarkerSuccess"
                                : "InputRoundedMarkerError"
                            }
                            className={cn({
                              "sr-only":
                                !isSubmitted ||
                                (!isAnswerChecked && !answer.isStudentAnswer),
                            })}
                          />
                        </label>
                      ) : (
                        <label htmlFor={answer.id}>
                          <Input
                            className={cn("w-4 h-4", {
                              "not-sr-only": !isSubmitted,
                              "sr-only":
                                isSubmitted &&
                                answer.isStudentAnswer &&
                                (isWrongAnswer || isCorrectAnswer),
                            })}
                            checked={selectedOption.includes(answer.id)}
                            id={answer.id}
                            type="checkbox"
                            value={answer.id}
                            {...register(
                              `multiAnswerQuestions.${questionId}.${answer.id}`,
                            )}
                          />
                          <Icon
                            name={
                              isCorrectAnswer
                                ? "InputRoundedMarkerSuccess"
                                : "InputRoundedMarkerError"
                            }
                            className={cn({
                              "sr-only":
                                !isSubmitted ||
                                (!isAnswerChecked && !answer.isStudentAnswer),
                            })}
                          />
                        </label>
                      )}
                      <Label
                        className="body-base font-normal text-neutral-950"
                        htmlFor={answer.id}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {answer.optionText}
                      </Label>
                    </button>
                  );
                })
              : null}
            {canRenderCorrectAnswers && (
              <div>
                <span className="body-base-md text-error-700">
                  Correct answers:
                </span>{" "}
                {"questionAnswers" in content &&
                  content.questionAnswers
                    .filter((answer) => answer.isCorrect)
                    .map((answer) => answer.optionText)
                    .join(", ")}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-4">{answers}</div>
    </Card>
  );
}
