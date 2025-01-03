import { Link, useLocation } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useEffect, useState } from "react";

import CourseProgress from "~/components/CourseProgress";
import { Icon } from "~/components/Icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { cn } from "~/lib/utils";
import { LessonTypesIcons } from "~/modules/Courses/CourseView/lessonTypes";

import type { GetCourseResponse } from "~/api/generated-api";

type LessonSidebarProps = {
  course: GetCourseResponse["data"];
  courseId: string;
};

const progressBadge = {
  completed: "InputRoundedMarkerSuccess",
  in_progress: "InProgress",
  not_started: "NotStartedRounded",
} as const;

export const LessonSidebar = ({ course, courseId }: LessonSidebarProps) => {
  const { state } = useLocation();
  const [activeChapter, setActiveChapter] = useState<string | undefined>(state?.chapterId);

  useEffect(() => {
    setActiveChapter(state?.chapterId);
  }, [state?.chapterId]);

  const handleAccordionChange = (value: string | undefined) => {
    setActiveChapter(value);
  };

  return (
    <div className="w-full bg-white h-full rounded-lg">
      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-4 px-8 pt-8">
          <div className="flex justify-between">
            <CategoryChip category={course.category} className="bg-primary-50 body-sm-md" />
          </div>
          <h1 className="h6 text-neutral-950">{course.title}</h1>
          <CourseProgress
            label="Course progress:"
            completedLessonCount={course.completedChapterCount ?? 0}
            courseLessonCount={course.courseChapterCount ?? 0}
          />
        </div>
        <div className="flex flex-col px-4 gap-y-4">
          <p className="px-4 body-lg-md text-neutral-950">Table of content:</p>
          <div className="flex flex-col">
            <Accordion
              type="single"
              collapsible
              value={activeChapter ?? course?.chapters?.[0]?.id}
              onValueChange={handleAccordionChange}
            >
              {course?.chapters?.map(({ id, title, lessons, chapterProgress }) => {
                return (
                  <AccordionItem value={id} key={id}>
                    <AccordionTrigger className="flex hover:bg-neutral-50 gap-x-4 px-6 py-4 text-start [&[data-state=open]>div>div>svg]:rotate-180 [&[data-state=open]>div>div>svg]:duration-200 [&[data-state=open]>div>div>svg]:ease-out data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg border">
                      <Badge
                        variant="icon"
                        icon={progressBadge[chapterProgress ?? "not_started"]}
                        iconClasses="w-6 h-auto shrink-0"
                      />
                      <div className="body-base-md text-neutral-950 text-start w-full">{title}</div>
                      <Icon name="CarretDownLarge" className="size-6 text-primary-700" />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col divide-y border-b">
                      {lessons?.map(({ id, title, status, type }) => {
                        return (
                          <Link
                            key={id}
                            to={status === "completed" ? `/course/${courseId}/lesson/${id}` : "#"}
                            className={cn("flex gap-x-4 py-2 px-6 border-x hover:bg-neutral-50", {
                              "bg-primary-50 border-l-2 border-l-primary-600":
                                status === "completed",
                              "cursor-not-allowed": status === "not_started",
                            })}
                          >
                            <Badge
                              variant="icon"
                              icon={progressBadge[status ?? "not_started"]}
                              iconClasses="w-6 h-auto shrink-0"
                            />{" "}
                            <div className="flex flex-col w-full">
                              <p className="body-sm-md text-neutral-950">{title}</p>
                              <p className="details text-neutral-800">{startCase(type)}</p>
                            </div>
                            <Icon
                              name={LessonTypesIcons[type]}
                              className="size-6 text-primary-700"
                            />
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};
