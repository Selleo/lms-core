import { useCallback, useEffect, useRef, useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

import { QuestionIcons, QuestionType } from "../QuizLessonForm.types";

type QuestionSelectorProps = {
  addQuestion: (questionType: QuestionType) => void;
};

const QuestionSelector = ({ addQuestion }: QuestionSelectorProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const toggleOptions = () => setShowOptions(!showOptions);
  const { t } = useTranslation();

  const onTypeChoose = useCallback(
    (type: QuestionType) => {
      setShowOptions(false);
      addQuestion(type);
    },
    [addQuestion],
  );

  const questionTypes = [
    {
      type: QuestionType.SINGLE_CHOICE,
      label: t("adminCourseView.curriculum.lesson.other.singleChoice"),
      icon: QuestionIcons.SingleSelect,
    },
    {
      type: QuestionType.MULTIPLE_CHOICE,
      label: t("adminCourseView.curriculum.lesson.other.multipleChoice"),
      icon: QuestionIcons.MultiSelect,
    },
    { type: QuestionType.TRUE_OR_FALSE, label: t("adminCourseView.curriculum.lesson.other.trueOrFalse"), icon: QuestionIcons.TrueOrFalse },
    {
      type: QuestionType.PHOTO_QUESTION_SINGLE_CHOICE,
      label: t("adminCourseView.curriculum.lesson.other.photoQuestion"),
      icon: QuestionIcons.PhotoQuestion,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS_DND,
      label: t('adminCourseView.curriculum.lesson.other.fillInTheBlanks'),
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS_TEXT,
      label: t('adminCourseView.curriculum.lesson.other.fillInTheBlanksText'),
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.BRIEF_RESPONSE,
      label: t('adminCourseView.curriculum.lesson.other.briefResponse'),
      icon: QuestionIcons.BriefResponse,
    },
    {
      type: QuestionType.DETAILED_RESPONSE,
      label: t('adminCourseView.curriculum.lesson.other.detailedResponse'),
      icon: QuestionIcons.DetailedResponse,
    },
    { type: QuestionType.MATCH_WORDS, label: t('adminCourseView.curriculum.lesson.other.matchWords'), icon: QuestionIcons.MatchWords },
    { type: QuestionType.SCALE_1_5, label: t('adminCourseView.curriculum.lesson.other.scale1_5'), icon: QuestionIcons.Scale_1_5 },
  ];

  useEffect(() => {
    if (showOptions && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      setOpenUpwards(spaceAbove > spaceBelow);
    }
  }, [showOptions]);
  return (
    <div className="relative mt-4">
      <Button
        type="button"
        className="mt-3 mb-4 bg-primary-700"
        onClick={toggleOptions}
        ref={buttonRef}
      >
        {t("adminCourseView.curriculum.lesson.button.addQuestion")}{" "}
        <Icon name={showOptions ? "ArrowUp" : "ArrowDown"} className="text-color-white ml-2" />
      </Button>

      {showOptions && (
        <Card
          className={cn(
            "absolute w-64 p-2 bg-white text-black rounded shadow-lg z-50 transition-all duration-200",
            openUpwards ? "bottom-full mb-2" : "top-full mt-2",
          )}
          ref={cardRef}
        >
          <p className="block p-2 text-left text-black border-b border-gray-300 body-base-md w-full">
            {t("adminCourseView.curriculum.lesson.other.selectQuestionType")}
          </p>
          {questionTypes.map(({ type, label, icon }) => {
            return (
              <Button
                key={type}
                className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start body-base-md"
                type="button"
                onClick={() => onTypeChoose(type)}
              >
                <Icon name={icon as QuestionIcons} className="mr-2 h-4 w-4 text-primary-700" />
                {label}
              </Button>
            );
          })}
        </Card>
      )}
    </div>
  );
};

export default QuestionSelector;
