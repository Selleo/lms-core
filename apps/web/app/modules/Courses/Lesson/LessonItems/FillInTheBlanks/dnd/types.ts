export type Word = {
  id: number | string;
  index: number;
  value: string;
};

export type DndWord = Word & {
  blankId: string;
};
