import * as Switch from "@radix-ui/react-switch";
import { useParams } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { useChangeChapterDisplayOrder } from "~/api/mutations/admin/changeChapterDisplayOrder";
import { useUpdateLessonFreemiumStatus } from "~/api/mutations/admin/useUpdateLessonFreemiumStatus";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { queryClient } from "~/api/queryClient";
import { Icon } from "~/components/Icon";
import { SortableList } from "~/components/SortableList/SortableList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useLeaveModal } from "~/context/LeaveModalContext";
import { cn } from "~/lib/utils";
import { LessonCardList } from "~/modules/Admin/EditCourse/CourseLessons/components/LessonCardList";

import { ContentTypes } from "../../EditCourse.types";

import type { Chapter, Lesson } from "../../EditCourse.types";
import type React from "react";

interface ChapterCardProps {
  chapter: Chapter;
  isOpen: boolean;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  setSelectedChapter: (selectedChapter: Chapter | null) => void;
  setSelectedLesson: (selectedLesson: Lesson | null) => void;
  selectedChapter: Chapter | null;
  selectedLesson: Lesson | null;
  dragTrigger: React.ReactNode;
}

const ChapterCard = ({
  chapter,
  isOpen,
  setContentTypeToDisplay,
  setSelectedChapter,
  setSelectedLesson,
  selectedChapter,
  selectedLesson,
  dragTrigger,
}: ChapterCardProps) => {
  const { mutateAsync: updateFreemiumStatus } = useUpdateLessonFreemiumStatus();
  const { id } = useParams();
  const { openLeaveModal, isCurrentFormDirty, setIsLeavingContent } = useLeaveModal();
  const [isNewLesson, setIsNewLesson] = useState(false);
  const [pendingChapter, setPendingChapter] = useState<Chapter | null>(null);

  const addLessonLogic = useCallback(() => {
    setSelectedLesson(null);
    setContentTypeToDisplay(ContentTypes.SELECT_LESSON_TYPE);
    setSelectedChapter(chapter);
  }, [chapter, setContentTypeToDisplay, setSelectedChapter, setSelectedLesson]);

  const handleAddLessonClick = useCallback(
    (event: React.MouseEvent) => {
      if (isCurrentFormDirty) {
        setIsNewLesson(true);
        openLeaveModal();
        return;
      }
      event.stopPropagation();
      addLessonLogic();
    },
    [openLeaveModal, addLessonLogic, isCurrentFormDirty],
  );

  const onClickChapterCard = useCallback(() => {
    if (isCurrentFormDirty) {
      setPendingChapter(chapter);
      setIsLeavingContent(true);
      openLeaveModal();
      return;
    }
    setContentTypeToDisplay(ContentTypes.CHAPTER_FORM);
    setSelectedChapter(chapter);
    setSelectedLesson(null);
  }, [chapter, setContentTypeToDisplay, setSelectedChapter, openLeaveModal]);

  const onAccordionClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedChapter(chapter);
      event.stopPropagation();
    },
    [chapter, setSelectedChapter],
  );

  useEffect(() => {
    if (!isCurrentFormDirty && pendingChapter) {
      onClickChapterCard();
      setPendingChapter(null);
      setIsLeavingContent(false);
    }
  }, [isCurrentFormDirty, pendingChapter, onClickChapterCard]);

  useEffect(() => {
    if (!isCurrentFormDirty && isNewLesson) {
      addLessonLogic();
      setIsNewLesson(false);
    }
  }, [isCurrentFormDirty, isNewLesson, addLessonLogic]);

  const onSwitchClick = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      try {
        await updateFreemiumStatus({
          chapterId: chapter.id,
          data: { isFreemium: !chapter.isFree },
        });
        queryClient.invalidateQueries({
          queryKey: [COURSE_QUERY_KEY, { id }],
        });
      } catch (error) {
        console.error("Failed to update chapter premium status:", error);
      }
    },
    [chapter, updateFreemiumStatus, id],
  );

  return (
    <AccordionItem key={chapter.id} value={chapter.id} className="p-0">
      <Card
        className={cn("mb-4 h-full flex p-4 border", {
          "border-primary-500": isOpen || selectedChapter?.id === chapter.id,
        })}
        onClick={onClickChapterCard}
      >
        <div className="flex w-full">
          <div className="flex-1 flex flex-col justify-between ml-2">
            <div className="flex items-center gap-x-3">
              {dragTrigger}
              <hgroup className="flex flex-col-reverse w-full">
                <h3 className="body-base-md text-neutral-950">{chapter.title}</h3>
                <div className="text-neutral-800 body-sm-md">
                  Chapter {chapter.displayOrder} • Lessons {chapter.lessons.length}
                </div>
              </hgroup>
              <AccordionTrigger className="cursor-pointer p-2" onClick={onAccordionClick}>
                <Icon name={isOpen ? "ArrowUp" : "ArrowDown"} className="text-gray-600" />
              </AccordionTrigger>
            </div>
            <AccordionContent className="mt-2 text-gray-700">
              {chapter.lessonCount > 0 ? (
                <LessonCardList
                  lessons={chapter.lessons}
                  selectedLesson={selectedLesson}
                  setSelectedLesson={setSelectedLesson}
                  setContentTypeToDisplay={setContentTypeToDisplay}
                />
              ) : (
                <div className="ml-9">No lessons</div>
              )}
            </AccordionContent>
            <div className="flex mt-3 justify-between items-center">
              <div
                className={cn("flex items-center space-x-2", {
                  "ml-9": !isOpen || chapter.lessons.length === 0,
                })}
              >
                <Button variant="outline" onClick={handleAddLessonClick} className="">
                  <Icon name="Plus" className="mr-2 text-primary-800" />
                  Add Lesson
                </Button>
              </div>
              <div className="flex items-center gap-x-2">
                <Switch.Root
                  className={cn("w-11 h-6 rounded-full relative transition-colors", {
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
                <span className="body-sm-md text-neutral-950">Freemium</span>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Icon name="Info" className="text-neutral-800 w-6 h-auto cursor-default" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="bg-black text-white text-sm px-2 py-1 rounded shadow-md"
                    >
                      Students can access freemium chapters without enrolling in the course.
                      <TooltipArrow className="fill-black" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
  setSelectedChapter: (selectedChapter: Chapter | null) => void;
  setSelectedLesson: (selectedLesson: Lesson | null) => void;
  selectedChapter: Chapter | null;
  selectedLesson: Lesson | null;
  canRefetchChapterList: boolean;
  isLeaveModalOpen?: boolean;
}

function getChapterWithLatestLesson(chapters: Chapter[]): string | null {
  let latestTime = 0;
  let latestChapterId: string | null = null;

  chapters.map((chapter) => {
    const chapterTime = chapter.updatedAt ? new Date(chapter.updatedAt).getTime() : 0;

    chapter.lessons.map((lesson) => {
      const lessonTime = new Date(lesson.updatedAt).getTime();
      if (lessonTime > latestTime) {
        latestTime = lessonTime;
        latestChapterId = chapter.id;
      }
    });

    if (chapterTime > latestTime) {
      latestTime = chapterTime;
      latestChapterId = chapter.id;
    }
  });

  return latestChapterId;
}

const ChaptersList = ({
  chapters,
  setContentTypeToDisplay,
  setSelectedChapter,
  setSelectedLesson,
  selectedChapter,
  selectedLesson,
  canRefetchChapterList,
}: ChaptersListProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [items, setItems] = useState(chapters);
  const mutation = useChangeChapterDisplayOrder();
  const chapterId = getChapterWithLatestLesson(chapters ?? []);

  useEffect(() => {
    setItems(chapters);

    if (canRefetchChapterList) {
      chapterId && setOpenItem(chapterId);
    }
  }, [chapters, canRefetchChapterList, chapterId]);

  if (!items) return;

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem}
      onValueChange={setOpenItem}
      defaultValue={openItem}
    >
      <SortableList
        items={items}
        onChange={(updatedItems, newChapterPosition, newDisplayOrder) => {
          flushSync(() => {
            setItems(updatedItems);

            mutation.mutate({
              chapter: {
                chapterId: updatedItems[newChapterPosition].id,
                displayOrder: newDisplayOrder,
              },
            });
          });
        }}
        className="grid grid-cols-1"
        renderItem={(chapter) => (
          <SortableList.Item id={chapter.id}>
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isOpen={openItem === chapter.id}
              setContentTypeToDisplay={setContentTypeToDisplay}
              setSelectedChapter={setSelectedChapter}
              setSelectedLesson={setSelectedLesson}
              selectedLesson={selectedLesson}
              selectedChapter={selectedChapter}
              dragTrigger={
                <SortableList.DragHandle>
                  <Icon name="DragAndDropIcon" className="cursor-move" />
                </SortableList.DragHandle>
              }
            />
          </SortableList.Item>
        )}
      />
    </Accordion>
  );
};

export default ChaptersList;
