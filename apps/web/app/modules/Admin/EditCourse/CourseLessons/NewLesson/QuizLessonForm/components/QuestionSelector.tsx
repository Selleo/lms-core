import { useCallback, useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { QuestionIcons, QuestionType } from "../QuizLessonForm.types";

type QuestionSelectorProps = {
  addQuestion: (questionType: string) => void;
};

const QuestionSelector = ({ addQuestion }: QuestionSelectorProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => setShowOptions(!showOptions);

  const onTypeChoose = useCallback(
    (type: string) => {
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
      type: QuestionType.PHOTO_QUESTION,
      label: "Photo question",
      icon: QuestionIcons.PhotoQuestion,
    },
    {
      type: QuestionType.FILL_IN_THE_BLANKS,
      label: "Fill in the blanks",
      icon: QuestionIcons.FillInTheBlanks,
    },
    {
      type: QuestionType.BRIEF_RESPONSE,
      label: "Brief response",
      icon: QuestionIcons.BriefResponse,
    },
    {
      type: QuestionType.DETAILED_RESPONSE,
      label: "Detailed response",
      icon: QuestionIcons.DetailedResponse,
    },
  ];

  return (
    <div className="relative mt-4">
      <Button type="button" className="mt-3 mb-4 bg-primary-700" onClick={toggleOptions}>
        Add question{" "}
        <Icon name={showOptions ? "ArrowUp" : "ArrowDown"} className="text-color-white ml-2" />
      </Button>

      {showOptions && (
        <Card className="absolute top-full mb-2 w-64 p-2 bg-white text-black rounded shadow-lg z-10">
          <p className="block p-2 text-left text-black border-b border-gray-300 body-base-md w-full">
            Select question type:
          </p>
          {questionTypes.map(({ type, label, icon }) => (
            <Button
              key={type}
              className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start body-base-md"
              type="button"
              onClick={() => onTypeChoose(type)}
            >
              <Icon name={icon as QuestionIcons} className="mr-2 h-4 w-4 text-primary-700" />
              {label}
            </Button>
          ))}
        </Card>
      )}
    </div>
  );
};

export default QuestionSelector;
