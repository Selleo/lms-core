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

import type { Chapter, Lesson } from "../EditCourse.types";
import QuizLessonForm from "./NewLesson/QuizLessonForm/QuizLessonForm";

interface CourseLessonsProps {
  chapters?: Chapter[];
  canRefetchChapterList: boolean;
}

const CourseLessons = ({ chapters, canRefetchChapterList }: CourseLessonsProps) => {
  const [contentTypeToDisplay, setContentTypeToDisplay] = useState(ContentTypes.EMPTY);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();
  const [selectedLesson, setSelectedLesson] = useState<Lesson>();

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
      [ContentTypes.QUIZ_FORM]: (
        <QuizLessonForm
          setContentTypeToDisplay={setContentTypeToDisplay}
          chapterToEdit={selectedChapter}
          lessonToEdit={selectedLesson}
        />
      ),
    };

    return contentMap[contentTypeToDisplay] || null;
  }, [contentTypeToDisplay, selectedChapter, selectedLesson]);

  return (
    <div className="flex h-full rounded-lg gap-x-8 basis-full">
      <div className="w-full md:max-w-[480px] justify-between h-full flex flex-col">
        <div className="flex h-full flex-col overflow-y-auto">
          <ChaptersList
            canRefetchChapterList={canRefetchChapterList}
            chapters={chapters}
            setContentTypeToDisplay={setContentTypeToDisplay}
            setSelectedChapter={setSelectedChapter}
            setSelectedLesson={setSelectedLesson}
            selectedChapter={selectedChapter}
            selectedLesson={selectedLesson}
          />
        </div>
        <Button
          onClick={addChapter}
          className="bg-primary-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          <Icon name="Plus" className="mr-2" />
          Add Chapter
        </Button>
      </div>
      <div className="w-full h-auto overflow-y-auto">{renderContent}</div>
    </div>
  );
};

export default CourseLessons;
