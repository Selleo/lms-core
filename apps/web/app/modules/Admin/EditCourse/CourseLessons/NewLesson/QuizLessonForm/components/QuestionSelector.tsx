import { useCallback, useState } from "react";

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

  const onTypeChoose = useCallback(
    (type: QuestionType) => {
      setShowOptions(false);
      addQuestion(type);
    },
    [addQuestion],
  );

  const questionTypes = [
    { type: QuestionType.SINGLE_CHOICE, label: "Single Select", icon: QuestionIcons.SingleSelect },
    { type: QuestionType.MULTIPLE_CHOICE, label: "Multi Select", icon: QuestionIcons.MultiSelect },
    { type: QuestionType.TRUE_OR_FALSE, label: "True or false", icon: QuestionIcons.TrueOrFalse },
    {
      type: QuestionType.PHOTO_QUESTION_SINGLE_CHOICE,
      label: "Photo question",
      icon: QuestionIcons.PhotoQuestion,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS_DND,
      label: "Fill in the blanks",
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS_TEXT,
      label: "Gap fill",
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.BRIEF_RESPONSE,
      label: "Short answer",
      icon: QuestionIcons.BriefResponse,
    },
    {
      type: QuestionType.DETAILED_RESPONSE,
      label: "Free text",
      icon: QuestionIcons.DetailedResponse,
    },
    { type: QuestionType.MATCH_WORDS, label: "Matching", icon: QuestionIcons.MatchWords },
    { type: QuestionType.SCALE_1_5, label: "Scale 1 to 5", icon: QuestionIcons.Scale_1_5 },
  ];

  return (
    <DropdownMenu onOpenChange={(open) => setShowOptions(open)}>
      <DropdownMenuTrigger asChild>
        <Button type="button" className="mt-3 mb-4 bg-primary-700">
          Add question{" "}
          <Icon name={showOptions ? "ArrowUp" : "ArrowDown"} className="text-color-white ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-white text-black rounded shadow-lg transition-all duration-200">
        <DropdownMenuLabel className="p-2 text-left text-black body-base-md w-full">
          Select question type:
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
