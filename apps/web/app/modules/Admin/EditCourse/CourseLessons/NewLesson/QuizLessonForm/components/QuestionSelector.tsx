import { useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const QuestionSelector = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="relative">
      <Button type="button" className="mt-3" onClick={toggleOptions}>
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
          >
            <Icon name="SingleSelect" className="mr-2" />
            Single Select
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
          >
            <Icon name="MultiSelect" className="mr-2" />
            Multi Select
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
          >
            <Icon name="TrueOrFalse" className="mr-2" />
            True or false
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
          >
            <Icon name="PhotoQuestion" className="mr-2" />
            Photo question
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
          >
            <Icon name="FillInTheBlanks" className="mr-2" />
            Fill in the blanks
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
          >
            <Icon name="BriefResponse" className="mr-2" />
            Brief response
          </Button>
          <Button
            className="w-full text-left text-black bg-white hover:bg-gray-100 justify-start"
            type="button"
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
