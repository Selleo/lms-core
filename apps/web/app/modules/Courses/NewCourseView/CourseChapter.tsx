import { CardBadge } from "~/components/CardBadge";
import { Icon } from "~/components/Icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { formatWithPlural } from "~/lib/utils";
import { ChapterCounter } from "~/modules/Courses/NewCourseView/components/ChapterCounter";
import { CourseChapterLesson } from "~/modules/Courses/NewCourseView/CourseChapterLesson";

import type { GetCourseResponse } from "~/api/generated-api";

type CourseChapterProps = {
  chapter: GetCourseResponse["data"]["chapters"][0];
  enrolled: GetCourseResponse["data"]["enrolled"];
};

export const CourseChapter = ({ chapter, enrolled }: CourseChapterProps) => {
  const lessonText = formatWithPlural(chapter.lessonCount ?? 0, "Lesson", "Lessons");
  const quizText = formatWithPlural(chapter.quizCount ?? 0, "Quiz", "Quizzes");

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <div className="flex gap-x-4 w-full">
          <ChapterCounter
            chapterProgress={chapter.chapterProgress}
            displayOrder={chapter.displayOrder}
          />
          <div className="flex flex-col w-full">
            <AccordionTrigger className="text-start [&[data-state=open]>div>div>svg]:rotate-180 [&[data-state=open]>div>div>svg]:duration-200 [&[data-state=open]>div>div>svg]:ease-out data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg data-[state=open]:border-primary-500 data-[state=open]:bg-primary-50 border">
              <div className="w-full gap-x-1 md:gap-x-4 px-2 py-4 md:p-4 flex items-center">
                <div className="grid place-items-center w-8 h-8">
                  <Icon name="CarretDownLarge" className="w-6 h-auto text-primary-700" />
                </div>
                <div className="flex flex-col w-full">
                  <div className="details text-neutral-800">
                    {lessonText} {lessonText && quizText ? "• " : ""} {quizText}
                  </div>
                  <p className="body-base-md text-neutral-950">{chapter.title}</p>
                  <div className="flex gap-x-1 max-w-[620px] items-center details text-neutral-800">
                    <span className="pr-2">
                      {chapter.completedLessonCount}/{chapter.lessonCount}
                    </span>
                    {Array.from({ length: chapter.lessonCount }).map((_, index) => {
                      if (!chapter.completedLessonCount) {
                        return (
                          <span key={index} className="h-1 w-full bg-primary-100 rounded-lg" />
                        );
                      }

                      if (chapter.completedLessonCount && index < chapter.completedLessonCount) {
                        return (
                          <span key={index} className="h-1 w-full bg-success-500 rounded-lg" />
                        );
                      }

                      return (
                        <span key={index} className="h-1 w-full bg-secondary-500 rounded-lg" />
                      );
                    })}
                  </div>
                </div>
                {chapter.isFreemium && (
                  <CardBadge variant="successFilled">
                    <Icon name="FreeRight" className="w-4" />
                    Free
                  </CardBadge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y pl-14 divide-neutral-200 pt-3 pb-4 rounded-b-lg border-b border-x border-primary-500">
                {chapter?.lessons?.map((lesson) => {
                  if (!lesson) return null;
                  return <CourseChapterLesson key={lesson.id} lesson={lesson} />;
                })}
                <Button className="mt-3 gap-x-2" disabled={!(chapter.isFreemium || enrolled)}>
                  {" "}
                  <Icon name="Play" className="w-4 h-auto" />
                  <span>
                    {chapter.chapterProgress === "completed"
                      ? "Open"
                      : chapter.chapterProgress === "in_progress"
                        ? "Continue"
                        : "Play chapter"}
                  </span>
                </Button>
              </div>
            </AccordionContent>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};
