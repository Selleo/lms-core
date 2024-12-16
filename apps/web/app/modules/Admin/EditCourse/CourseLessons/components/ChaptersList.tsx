import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useParams } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";

import { useUpdateLessonFreemiumStatus } from "~/api/mutations/admin/useUpdateLessonFreemiumStatus";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { queryClient } from "~/api/queryClient";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { ContentTypes, LessonType } from "../../EditCourse.types";

import LessonCard from "./LessonCard";

import type { Chapter, Lesson } from "../../EditCourse.types";
import type React from "react";

interface ChapterCardProps {
  chapter: Chapter;
  isOpen: boolean;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  setSelectedChapter: (selectedChapter: Chapter) => void;
  setSelectedLesson: (selectedLesson?: Lesson) => void;
}

const ChapterCard = ({
  chapter,
  isOpen,
  setContentTypeToDisplay,
  setSelectedChapter,
  setSelectedLesson,
}: ChapterCardProps) => {
  const { mutateAsync: updateFreemiumStatus } = useUpdateLessonFreemiumStatus();
  const { id } = useParams();

  const handleAddLessonClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedLesson(undefined);
      setContentTypeToDisplay(ContentTypes.SELECT_LESSON_TYPE);
      setSelectedChapter(chapter);
    },
    [chapter, setContentTypeToDisplay, setSelectedChapter, setSelectedLesson],
  );

  const onClickChapterCard = useCallback(() => {
    setContentTypeToDisplay(ContentTypes.CHAPTER_FORM);
    setSelectedChapter(chapter);
  }, [chapter, setContentTypeToDisplay, setSelectedChapter]);

  const onClickLessonCard = useCallback(
    (lesson: Lesson) => {
      const contentType = lesson.type;
      setSelectedLesson(lesson);

      switch (contentType) {
        case LessonType.VIDEO:
          setContentTypeToDisplay(ContentTypes.VIDEO_LESSON_FORM);
          break;
        case LessonType.TEXT_BLOCK:
          setContentTypeToDisplay(ContentTypes.TEXT_LESSON_FORM);
          break;
        case LessonType.PRESENTATION:
          setContentTypeToDisplay(ContentTypes.PRESENTATION_FORM);
          break;
        case LessonType.QUIZ:
          setContentTypeToDisplay(ContentTypes.QUIZ_FORM);
          break;
        default:
          setContentTypeToDisplay(ContentTypes.EMPTY);
      }
    },
    [setContentTypeToDisplay, setSelectedLesson],
  );

  const onAccordionClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedChapter(chapter);
      event.stopPropagation();
    },
    [chapter, setSelectedChapter],
  );

  const onSwitchClick = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      try {
        await updateFreemiumStatus({
          chapterId: chapter.id,
          data: { isFreemium: !chapter.isFree },
        });
        queryClient.invalidateQueries({
          queryKey: [COURSE_QUERY_KEY, { id }],
        });
      } catch (error) {
        console.error("Failed to update chapter freemium status:", error);
      }
    },
    [chapter, updateFreemiumStatus, id],
  );

  const lessons = useMemo(() => chapter.lessons, [chapter.lessons]);

  return (
    <AccordionItem
      key={`chapter-${chapter.id}`}
      value={`item-${chapter.id}`}
      className="p-0"
      draggable
    >
      <Card
        className={cn("mb-4 h-full flex p-4 border", { "border-primary-500": isOpen })}
        onClick={onClickChapterCard}
      >
        <div className="flex w-full">
          <div className="w-1/10 flex mt-2.5">
            <Icon name="DragAndDropIcon" />
          </div>
          <div className="flex-1 flex flex-col justify-between ml-2">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 text-sm">Chapter {chapter.displayOrder}</div>
              <AccordionTrigger className="cursor-pointer" onClick={onAccordionClick}>
                <Icon name={isOpen ? "ArrowUp" : "ArrowDown"} className="text-gray-600" />
              </AccordionTrigger>
            </div>
            <h3 className="text-xl text-black">{chapter.title}</h3>
            <AccordionContent className="mt-2 text-gray-700">
              <div className="mt-4 grid grid-cols-1 gap-4">
                {lessons === null || lessons?.length === 0 ? (
                  <p>No lessons for this chapter</p>
                ) : (
                  lessons.map((item, index) => {
                    const key = item.id || `lesson-${index}`;
                    return (
                      <LessonCard key={key} item={item} onClickLessonCard={onClickLessonCard} />
                    );
                  })
                )}
              </div>
            </AccordionContent>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleAddLessonClick}
                  className="px-4 py-2 text-blue-600 bg-white border border-gray-300 rounded-md flex items-center"
                >
                  <Icon name="Plus" className="mr-2 text-blue-600" />
                  Add Lesson
                </Button>
              </div>
              <div className="flex items-center">
                <Switch.Root
                  className={cn("w-10 h-6 mr-2 rounded-full relative transition-colors", {
                    "bg-blue-500": chapter.isFree,
                    "bg-gray-200": !chapter.isFree,
                  })}
                  onClick={onSwitchClick}
                  checked={chapter.isFree}
                >
                  <Switch.Thumb
                    className={cn(
                      "block w-4 h-4 bg-white rounded-full transition-transform transform translate-x-1",
                      chapter.isFree ? "translate-x-6" : "",
                    )}
                  />
                </Switch.Root>
                <span className="mr-2 text-gray-600">Freemium</span>
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={0}>
                    <Tooltip.Trigger asChild>
                      <span>
                        <Icon name="Info" className="text-gray-600 cursor-default" />
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        align="center"
                        className="bg-black text-white text-sm px-2 py-1 rounded shadow-md"
                      >
                        Students can access freemium chapters without enrolling in the course.
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </AccordionItem>
  );
};

interface ChaptersListProps {
  chapters?: Chapter[];
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  setSelectedChapter: (selectedChapter: Chapter) => void;
  setSelectedLesson: (selectedLesson?: Lesson) => void;
}

const ChaptersList = ({
  chapters,
  setContentTypeToDisplay,
  setSelectedChapter,
  setSelectedLesson,
}: ChaptersListProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const chapterCards = useMemo(
    () =>
      chapters?.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          isOpen={openItem === `item-${chapter.id}`}
          setContentTypeToDisplay={setContentTypeToDisplay}
          setSelectedChapter={setSelectedChapter}
          setSelectedLesson={setSelectedLesson}
        />
      )),
    [chapters, openItem, setContentTypeToDisplay, setSelectedChapter, setSelectedLesson],
  );

  return (
    <div>
      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
        {chapterCards}
      </Accordion>
    </div>
  );
};

export default ChaptersList;
