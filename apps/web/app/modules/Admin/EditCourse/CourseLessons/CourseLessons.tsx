import { useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";

import { ContentTypes } from "../EditCourse.types";

import ChaptersList from "./components/ChaptersList";
import CourseLessonEmptyState from "./components/CourseLessonEmptyState";
import NewChapter from "./NewChapter/NewChapter";
import SelectLessonType from "./NewLesson/components/SelectLessonType";
import NewTextLesson from "./NewLesson/NewTextLesson/NewTextLesson";

import type { Chapter } from "../EditCourse.types";

interface CourseLessonsProps {
  chapters?: Chapter[];
}

const CourseLessons = ({ chapters }: CourseLessonsProps) => {
  const [contentTypeToDisplay, setContentTypeToDisplay] = useState(ContentTypes.EMPTY);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();

  const renderContent = () => {
    switch (contentTypeToDisplay) {
      case ContentTypes.EMPTY:
        return <CourseLessonEmptyState />;
      case ContentTypes.NEW_CHAPTER:
        return <NewChapter setContentTypeToDisplay={setContentTypeToDisplay} />;
      case ContentTypes.EDIT_CHAPTER:
        return (
          <NewChapter setContentTypeToDisplay={setContentTypeToDisplay} chapter={selectedChapter} />
        );
      case ContentTypes.ADD_TEXT_LESSON:
        return (
          <NewTextLesson
            setContentTypeToDisplay={setContentTypeToDisplay}
            chapterToEdit={selectedChapter}
          />
        );
      case ContentTypes.SELECT_LESSON_TYPE:
        return <SelectLessonType setContentTypeToDisplay={setContentTypeToDisplay} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-full md:w-2/5 h-full flex flex-col justify-start">
        <ChaptersList
          chapters={chapters as Chapter[]}
          setContentTypeToDisplay={setContentTypeToDisplay}
          setSelectedChapter={setSelectedChapter}
        />
        <Button
          onClick={() => setContentTypeToDisplay(ContentTypes.NEW_CHAPTER)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          <Icon name="Plus" className="mr-2" />
          New Chapter
        </Button>
      </div>
      <div className="w-full md:w-3/5 h-full bg-gray-100 ml-5">{renderContent()}</div>
    </div>
  );
};

export default CourseLessons;
