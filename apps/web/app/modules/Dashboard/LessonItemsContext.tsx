import React, { createContext, useContext, useState, ReactNode } from "react";

interface LessonItemsContextType {
  lessonItems: LessonItem[];
  setLessonItems: React.Dispatch<React.SetStateAction<LessonItem[]>>;
  updateLessonItem: (updatedItem: LessonItem) => void;
}

const LessonItemsContext = createContext<LessonItemsContextType | undefined>(
  undefined
);
const initialLessonItems: LessonItem[] = [
  {
    id: "728ed51f",
    title: "Testing",
    status: "Completed",
    author: "Ja",
    type: "Video",
    description:
      "Very very very very very very very very very very very very very great course :D",
    video: null,
  },
  {
    id: "728ed52f",
    title: "Advanced Testing",
    status: "Not Started",
    type: "Text",
    author: "Jan",
    description:
      "Learn advanced testing techniques to improve your software quality.",
    video: null,
  },
  {
    id: "728ed53f",
    title: "Unit Testing",
    status: "Completed",
    type: "Text",
    author: "Anna",
    description:
      "Understand the fundamentals of unit testing with practical examples.",
    video: null,
  },
  {
    id: "728ed54f",
    title: "Integration Testing",
    status: "Not Started",
    type: "Text",
    author: "Karol",
    description:
      "Master integration testing to ensure different parts of your application work together.",
    video: null,
  },
  {
    id: "728ed55f",
    title: "End-to-End Testing",
    status: "Not Started",
    type: "Text",
    author: "Marta",
    description:
      "Comprehensive guide to end-to-end testing with real-world scenarios.",
    video: null,
  },
  {
    id: "728ed56f",
    title: "Performance Testing",
    status: "Completed",
    type: "Text",
    author: "Adam",
    description:
      "Learn how to perform performance testing to ensure your application can handle load.",
    video: null,
  },
  {
    id: "728ed57f",
    title: "Security Testing",
    status: "Not Started",
    type: "Text",
    author: "Ewa",
    description:
      "Introduction to security testing to protect your application from vulnerabilities.",
    video: null,
  },
  {
    id: "728ed58f",
    title: "Automated Testing",
    status: "Not Started",
    type: "Text",
    author: "Piotr",
    description:
      "Automate your testing process to save time and increase efficiency.",
    video: null,
  },
  {
    id: "728ed59f",
    title: "Manual Testing",
    status: "Completed",
    type: "Text",
    author: "Ola",
    description: "Detailed guide to manual testing practices and techniques.",
    video: null,
  },
  {
    id: "728ed510f",
    title: "Regression Testing",
    status: "Not Started",
    type: "Text",
    author: "Tomek",
    description:
      "Ensure your changes do not break existing functionality with regression testing.",
    video: null,
  },
  {
    id: "728ed511f",
    title: "User Acceptance Testing",
    status: "Not Started",
    type: "Text",
    author: "Ania",
    description:
      "Learn how to perform user acceptance testing to meet user requirements.",
    video: null,
  },
  {
    id: "728ed512f",
    title: "Load Testing",
    status: "Completed",
    type: "Text",
    author: "Bartek",
    description:
      "Load testing strategies to ensure your application can handle expected traffic.",
    video: null,
  },
  {
    id: "728ed513f",
    title: "Stress Testing",
    status: "Not Started",
    type: "Text",
    author: "Kasia",
    description:
      "Identify breaking points with stress testing under extreme conditions.",
    video: null,
  },
  {
    id: "728ed514f",
    title: "Exploratory Testing",
    status: "Not Started",
    type: "Text",
    author: "Kuba",
    description:
      "Explore the application without predefined test cases to discover defects.",
    video: null,
  },
  {
    id: "728ed515f",
    title: "Compatibility Testing",
    status: "Completed",
    type: "Text",
    author: "Wojtek",
    description:
      "Ensure your application works across different browsers and devices.",
    video: null,
  },
  {
    id: "728ed516f",
    title: "Functional Testing",
    status: "Not Started",
    type: "Text",
    author: "Monika",
    description:
      "Verify that each function of the application operates according to requirements.",
    video: null,
  },
  {
    id: "728ed517f",
    title: "Non-Functional Testing",
    status: "Not Started",
    type: "Text",
    description:
      "Verify that each function of the application operates according to requirements.",
    author: "Luk",
  },
];

const LessonItemsProvider = ({ children }: { children: ReactNode }) => {
  const [lessonItems, setLessonItems] =
    useState<LessonItem[]>(initialLessonItems);

  const updateLessonItem = (updatedItem: LessonItem) => {
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
