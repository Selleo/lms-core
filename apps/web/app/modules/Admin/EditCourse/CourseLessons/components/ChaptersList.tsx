import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

import { ContentTypes } from "../../EditCourse.types";

import LessonCard from "./LessonCard";

import type { Chapter } from "../../EditCourse.types";
import type React from "react";

interface ChaptersListProps {
  chapters: Chapter[];
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  setSelectedChapter: (selectedChapter: Chapter) => void;
}

const ChapterCard: React.FC<{
  chapter: Chapter;
  isOpen: boolean;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  setSelectedChapter: (selectedChapter: Chapter) => void;
}> = ({ chapter, isOpen, setContentTypeToDisplay, setSelectedChapter }) => {
  const handleAddLessonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setContentTypeToDisplay(ContentTypes.SELECT_LESSON_TYPE);
    setSelectedChapter(chapter);
  };

  const onClickChapterCard = () => {
    setContentTypeToDisplay(ContentTypes.EDIT_CHAPTER);
    setSelectedChapter(chapter);
  };

  const lessonItems = chapter.lessonItems;

  return (
    <AccordionItem value={`item-${chapter.id}`} className="p-0" draggable>
      <Card className="mb-4 h-full flex p-4" onClick={() => onClickChapterCard()}>
        <div className="flex w-full">
          <div className="w-1/10 flex mt-2.5">
            <Icon name="DragAndDropIcon" />
          </div>
          <div className="flex-1 flex flex-col justify-between ml-2">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 text-sm">Chapter {chapter.displayOrder}</div>
              <AccordionTrigger className="cursor-pointer">
                <Icon name={isOpen ? "ArrowUp" : "ArrowDown"} className="text-gray-600" />
              </AccordionTrigger>
            </div>
            <h3 className="text-m text-black">{chapter.title}</h3>
            <AccordionContent className="mt-2 text-gray-700">
              <div className="mt-4 grid grid-cols-1 gap-4">
                {lessonItems?.length === 0 ? (
                  <p>No items for this lesson</p>
                ) : (
                  lessonItems?.map((item) => <LessonCard key={item.id} item={item} />)
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
                  className="w-10 h-6 bg-gray-200 mr-2 rounded-full relative"
                  checked={false}
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform transform translate-x-1 data-[state=checked]:translate-x-6" />
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

const ChaptersList = ({
  chapters,
  setContentTypeToDisplay,
  setSelectedChapter,
}: ChaptersListProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div>
      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
        {chapters?.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            isOpen={openItem === `item-${chapter.id}`}
            setContentTypeToDisplay={setContentTypeToDisplay}
            setSelectedChapter={setSelectedChapter}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ChaptersList;
