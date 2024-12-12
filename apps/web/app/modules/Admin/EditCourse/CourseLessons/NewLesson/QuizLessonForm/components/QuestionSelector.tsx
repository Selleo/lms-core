import { useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

type QuestionSelectorProps = {
  addQuestion: (questionType: string) => void;
};

const QuestionSelector = ({ addQuestion }: QuestionSelectorProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const onTypeChoose = (type: string) => {
    setShowOptions(!showOptions);
    addQuestion(type);
  };

  return (
    <div className="relative mt-4">
      <Button type="button" className="mt-3 mb-4" onClick={toggleOptions}>
        Add question{" "}
        <Icon
          name={showOptions ? "ArrowUp" : "ArrowDown"}
          className="text-color-white ml-2 mt-0.75"
        />
      </Button>

      {showOptions && (
        <Card className="absolute bottom-full mb-2 w-64 p-4 bg-white text-black rounded shadow-lg">
          <p className="p-2 text-left text-black border-b border-gray-300">Select question type:</p>

          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("single_choice")}
          >
            <Icon name="SingleSelect" className="mr-2" />
            Single Select
          </Button>

          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("multiple_choice")}
          >
            <Icon name="MultiSelect" className="mr-2" />
            Multi Select
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("true_or_false")}
          >
            <Icon name="TrueOrFalse" className="mr-2" />
            True or false
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("photo_question")}
          >
            <Icon name="PhotoQuestion" className="mr-2 h-4 w-4" />
            Photo question
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("fill_in_the_blanks")}
          >
            <Icon name="FillInTheBlanks" className="mr-2" />
            Fill in the blanks
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("brief_response")}
          >
            <Icon name="BriefResponse" className="mr-2" />
            Brief response
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
            onClick={() => onTypeChoose("detailed_response")}
          >
            <Icon name="DetailedResponse" className="mr-2" />
            Detailed response
          </Button>
        </Card>
      )}
    </div>
  );
};

export default QuestionSelector;
