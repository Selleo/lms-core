import { Control } from "react-hook-form";
import { UpdateQuestionItemBody } from "~/api/generated-api";

export interface QuestionItemProps {
  id: string;
  initialData: {
    questionType: string;
    questionBody: string;
    state: string;
    solutionExplanation: string | null;
  };
  onUpdate: () => void;
}

export interface SortableAnswerOptionProps {
  id: string;
  index: number;
  isEditing: boolean;
  control: Control<UpdateQuestionItemBody>;
  onRemove: () => void;
}

export interface QuestionAnswer {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  position: number;
  questionId: string;
}
