import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { QuestionIcons, QuestionType } from "../QuizLessonForm.types";

type QuestionSelectorProps = {
  addQuestion: (questionType: QuestionType) => void;
};

const QuestionSelector = ({ addQuestion }: QuestionSelectorProps) => {
  const [showOptions, setShowOptions] = useState(false);
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
    {
      type: QuestionType.TRUE_OR_FALSE,
      label: t("adminCourseView.curriculum.lesson.other.trueOrFalse"),
      icon: QuestionIcons.TrueOrFalse,
    },
    {
      type: QuestionType.PHOTO_QUESTION_SINGLE_CHOICE,
      label: t("adminCourseView.curriculum.lesson.other.photoQuestion"),
      icon: QuestionIcons.PhotoQuestion,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS_DND,
      label: t("adminCourseView.curriculum.lesson.other.fillInTheBlanks"),
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS_TEXT,
      label: t("adminCourseView.curriculum.lesson.other.fillInTheBlanksText"),
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.BRIEF_RESPONSE,
      label: t("adminCourseView.curriculum.lesson.other.briefResponse"),
      icon: QuestionIcons.BriefResponse,
    },
    {
      type: QuestionType.DETAILED_RESPONSE,
      label: t("adminCourseView.curriculum.lesson.other.detailedResponse"),
      icon: QuestionIcons.DetailedResponse,
    },
    {
      type: QuestionType.MATCH_WORDS,
      label: t("adminCourseView.curriculum.lesson.other.matchWords"),
      icon: QuestionIcons.MatchWords,
    },
    {
      type: QuestionType.SCALE_1_5,
      label: t("adminCourseView.curriculum.lesson.other.scale1_5"),
      icon: QuestionIcons.Scale_1_5,
    },
  ];

  return (
    <DropdownMenu onOpenChange={(open) => setShowOptions(open)}>
      <DropdownMenuTrigger asChild>
        <Button type="button" className="mt-3 mb-4 bg-primary-700">
          {t("adminCourseView.curriculum.lesson.button.addQuestion")}{" "}
          <Icon name={showOptions ? "ArrowUp" : "ArrowDown"} className="text-color-white ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-white text-black rounded shadow-lg transition-all duration-200">
        <DropdownMenuLabel className="p-2 text-left text-black body-base-md w-full">
          {t("adminCourseView.curriculum.lesson.other.selectQuestionType")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-scroll scrollbar-thin">
          {questionTypes.map(({ type, label, icon }) => {
            return (
              <DropdownMenuItem key={label}>
                <Button
                  key={type}
                  className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start body-base-md"
                  type="button"
                  onClick={() => onTypeChoose(type)}
                >
                  <Icon name={icon as QuestionIcons} className="mr-2 h-4 w-4 text-primary-700" />
                  {label}
                </Button>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuestionSelector;
