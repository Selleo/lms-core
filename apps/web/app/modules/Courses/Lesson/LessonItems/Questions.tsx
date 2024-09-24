import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

type TProps = {
  content: {
    id: string;
    questionType: string;
    questionBody: string;
    questionAnswers: {
      id: string;
      optionText: string;
      position: number | null;
    }[];
  };
};

export default function Questions({ content }: TProps) {
  const [seletedOption, setSeletedOption] = useState<string[]>([]);
  const [openQuestion, setOpenQuestion] = useState("");
  const isSingleQuestion = content.questionType === "single_choice";
  const isOpenAnswer = content.questionType === "open_answer";

  const handleClcik = (id: string) => {
    if (isSingleQuestion) {
      setSeletedOption([id]);
    } else {
      if (seletedOption.includes(id)) {
        setSeletedOption(seletedOption.filter((option) => option !== id));
      } else {
        setSeletedOption([...seletedOption, id]);
      }
    }
  };

  return (
    <Card className="flex flex-col gap-2 p-8">
      <div className="details text-primary-700 uppercase">{`question`}</div>
      <div
        className="h6 text-neutral-950"
        dangerouslySetInnerHTML={{ __html: content.questionBody }}
      />
      <div className="body-base-md text-neutral-900">
        {isOpenAnswer
          ? `Instruction: Provide a brief response.`
          : `Type: ${isSingleQuestion ? "Single" : "Multiple"} select question.`}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {isOpenAnswer ? (
          <Textarea
            value={openQuestion}
            onChange={(e) => setOpenQuestion(e.target.value)}
          />
        ) : (
          content.questionAnswers.map((answer) => (
            <button
              onClick={() => handleClcik(answer.id)}
              key={answer.id}
              className="flex items-center space-x-3 border border-primary-200 rounded-lg py-3 px-4"
            >
              <Input
                className={cn("w-4 h-4 border-red-500", {
                  "radio-square": !isSingleQuestion,
                })}
                checked={seletedOption.includes(answer.id)}
                id={answer.id}
                readOnly
                type="radio"
                value={answer.id}
              />
              <Label
                className="body-base text-neutral-950"
                htmlFor={answer.id}
                onClick={(e) => e.stopPropagation()}
              >
                {answer.optionText}
              </Label>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
