import { useMemo, useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";

import { ContentTypes } from "../EditCourse.types";

import ChaptersList from "./components/ChaptersList";
import CourseLessonEmptyState from "./components/CourseLessonEmptyState";
import NewChapter from "./NewChapter/NewChapter";
import SelectLessonType from "./NewLesson/components/SelectLessonType";
import FileLessonForm from "./NewLesson/FileLessonForm/FileLessonForm";
import TextLessonForm from "./NewLesson/TextLessonForm/TextLessonForm";

import type { Chapter, LessonItem } from "../EditCourse.types";

interface CourseLessonsProps {
  chapters?: Chapter[];
}

const CourseLessons = ({ chapters }: CourseLessonsProps) => {
  const [contentTypeToDisplay, setContentTypeToDisplay] = useState(ContentTypes.EMPTY);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();
  const [selectedLesson, setSelectedLesson] = useState<LessonItem>();

  const addChapter = () => {
    setContentTypeToDisplay(ContentTypes.CHAPTER_FORM);
    setSelectedChapter(undefined);
  };

  const renderContent = useMemo(() => {
    const contentMap: Record<string, JSX.Element | null> = {
      [ContentTypes.EMPTY]: <CourseLessonEmptyState />,
      [ContentTypes.CHAPTER_FORM]: (
        <NewChapter setContentTypeToDisplay={setContentTypeToDisplay} chapter={selectedChapter} />
      ),
      [ContentTypes.VIDEO_LESSON_FORM]: (
        <FileLessonForm
          contentTypeToDisplay={contentTypeToDisplay}
          setContentTypeToDisplay={setContentTypeToDisplay}
          chapterToEdit={selectedChapter}
          lessonToEdit={selectedLesson}
        />
      ),
      [ContentTypes.PRESENTATION_FORM]: (
        <FileLessonForm
          contentTypeToDisplay={contentTypeToDisplay}
          setContentTypeToDisplay={setContentTypeToDisplay}
          chapterToEdit={selectedChapter}
          lessonToEdit={selectedLesson}
        />
      ),
      [ContentTypes.TEXT_LESSON_FORM]: (
        <TextLessonForm
          setContentTypeToDisplay={setContentTypeToDisplay}
          chapterToEdit={selectedChapter}
          lessonToEdit={selectedLesson}
        />
      ),
      [ContentTypes.SELECT_LESSON_TYPE]: (
        <SelectLessonType setContentTypeToDisplay={setContentTypeToDisplay} />
      ),
    };

    return contentMap[contentTypeToDisplay] || null;
  }, [contentTypeToDisplay, selectedChapter, selectedLesson]);

  return (
    <div className="flex bg-white h-full">
      <div className="w-full md:w-2/5 h-full flex flex-col">
        <ChaptersList
          chapters={chapters as Chapter[]}
          setContentTypeToDisplay={setContentTypeToDisplay}
          setSelectedChapter={setSelectedChapter}
          setSelectedLesson={setSelectedLesson}
        />
        <div className="flex-grow" />
        <Button
          onClick={addChapter}
          className="bg-[#3F58B6] text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
        >
          <Icon name="Plus" className="mr-2" />
          Add Chapter
        </Button>
      </div>
      <div className="w-full md:w-3/5 h-full bg-gray-100 ml-5">{renderContent}</div>
    </div>
  );
};

export default CourseLessons;
