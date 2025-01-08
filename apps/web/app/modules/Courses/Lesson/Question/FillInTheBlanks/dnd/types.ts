export type Word = {
  id: string;
  index: null | number;
  value: string;
  isStudentAnswer?: boolean | null | undefined;
  isCorrect?: boolean | null | undefined;
  studentAnswerText?: string | null;
};

export type DndWord = Word & {
  blankId: string;
};
