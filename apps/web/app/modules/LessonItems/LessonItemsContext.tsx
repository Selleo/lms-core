import React, { createContext, useContext, useState, ReactNode } from "react";

interface LessonItem {
  id: string;
  name: string;
  displayName: string;
  description: string;
  video?: File | null;
}

interface EditLessonItem extends LessonItem {
  description: string;
}

interface LessonItemsContextType {
  lessonItems: LessonItem[];
  setLessonItems: React.Dispatch<React.SetStateAction<LessonItem[]>>;
  updateLessonItem: (updatedItem: EditLessonItem) => void;
}

const LessonItemsContext = createContext<LessonItemsContextType | undefined>(
  undefined
);
const initialLessonItems: LessonItem[] = [
  {
    id: "728ed51f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed52f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed53f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed54f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed55f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed56f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed57f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed58f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed59f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed510f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed511f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed512f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed513f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed514f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed515f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed516f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed517f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed518f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed519f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed520f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed521f",
    name: "Testing",
    displayName: "Testing",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
];

const LessonItemsProvider = ({ children }: { children: ReactNode }) => {
  const [lessonItems, setLessonItems] =
    useState<LessonItem[]>(initialLessonItems);

  const updateLessonItem = (updatedItem: EditLessonItem) => {
    setLessonItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return (
    <LessonItemsContext.Provider
      value={{
        lessonItems,
        setLessonItems,
        updateLessonItem,
      }}
    >
      {children}
    </LessonItemsContext.Provider>
  );
};

const useLessonItems = (): LessonItemsContextType => {
  const context = useContext(LessonItemsContext);
  if (!context) {
    throw new Error("useLessonItems must be used within a LessonItemsProvider");
  }
  return context;
};

export { LessonItemsProvider, useLessonItems };
