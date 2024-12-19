import { CardBadge } from "~/components/CardBadge";
import { Icon } from "~/components/Icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { cn, formatWithPlural } from "~/lib/utils";
import { CourseChapterLesson } from "~/modules/Courses/NewCourseView/CourseChapterLesson";

import type { GetCourseResponse } from "~/api/generated-api";

const cardBadgeIcon = {
  completed: "InputRoundedMarkerSuccess",
  in_progress: "InProgress",
  not_started: "NotStartedRounded",
} as const;

type CourseChapterProps = {
  chapter: GetCourseResponse["data"]["chapters"][0];
};

export const CourseChapter = ({ chapter }: CourseChapterProps) => {
  const lessonText = formatWithPlural(chapter.lessonCount ?? 0, "Lesson", "Lessons");
  const quizText = formatWithPlural(chapter.quizCount ?? 0, "Quiz", "Quizzes");

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <div className="flex gap-x-4 w-full">
          <div className="flex flex-col items-center gap-y-1">
            <div
              className={cn("size-10 relative rounded-full aspect-square", {
                "bg-success-50": chapter.chapterProgress === "completed",
                "bg-secondary-50": chapter.chapterProgress === "in_progress",
                "bg-primary-50": chapter.chapterProgress === "not_started",
              })}
            >
              {!chapter.chapterProgress || chapter.chapterProgress === "not_started" ? (
                <span className="body-base-md text-primary-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  0{chapter.displayOrder}
                </span>
              ) : (
                <Icon
                  name={cardBadgeIcon[chapter.chapterProgress ?? "not_started"]}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </div>
            <div
              className={cn("w-0.5 h-full", {
                "bg-success-200": chapter.chapterProgress === "completed",
                "bg-secondary-200": chapter.chapterProgress === "in_progress",
                "bg-primary-200": chapter.chapterProgress === "not_started",
              })}
            />
          </div>
          <div className="flex flex-col w-full">
            <AccordionTrigger className="text-start [&[data-state=open]>div>div>svg]:rotate-180 [&[data-state=open]>div>div>svg]:duration-200 [&[data-state=open]>div>div>svg]:ease-out data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg data-[state=open]:border-primary-500 data-[state=open]:bg-primary-50 border">
              <div className="w-full gap-x-4 p-4 flex items-center">
                <div className="grid place-items-center w-8 h-8">
                  <Icon name="CarretDown" className="w-6 text-primary-700" />
                </div>
                <div className="flex flex-col w-full">
                  <div className="details text-neutral-800">
                    {lessonText} {lessonText && quizText ? "- " : ""} {quizText}
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
                <Button className="mt-3 gap-x-2" disabled={!chapter.isFreemium}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.45833 2.47682C3.53696 2.42947 3.62648 2.40322 3.71824 2.40061C3.80999 2.39799 3.90086 2.4191 3.98206 2.46189L13.5821 7.52855C13.6678 7.57389 13.7395 7.64175 13.7896 7.72482C13.8396 7.80789 13.8661 7.90304 13.8661 8.00002C13.8661 8.097 13.8396 8.19215 13.7896 8.27522C13.7395 8.35829 13.6678 8.42615 13.5821 8.47149L3.98206 13.5382C3.90081 13.5809 3.80989 13.602 3.7181 13.5994C3.62631 13.5967 3.53676 13.5704 3.45812 13.523C3.37949 13.4756 3.31442 13.4087 3.26924 13.3287C3.22405 13.2488 3.20027 13.1585 3.2002 13.0667V2.93335C3.20025 2.84147 3.22404 2.75115 3.26927 2.67117C3.31449 2.59118 3.37962 2.52423 3.45833 2.47682ZM4.26686 3.81762V12.1824L12.1911 8.00002L4.26686 3.81762Z"
                      fill="#FCFCFC"
                    />
                  </svg>
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
