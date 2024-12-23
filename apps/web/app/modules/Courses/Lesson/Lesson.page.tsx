import { Link, useParams } from "@remix-run/react";
import { noop, startCase } from "lodash-es";

import { useCourse, useLesson } from "~/api/queries";
import CourseProgress from "~/components/CourseProgress";
import { Icon } from "~/components/Icon";
import { PageWrapper } from "~/components/PageWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { cn } from "~/lib/utils";
import { LessonContent } from "~/modules/Courses/Lesson/LessonContent";
import { LessonTypesIcons } from "~/modules/Courses/NewCourseView/lessonTypes";

export default function LessonPage() {
  const { courseId = "", lessonId = "" } = useParams();
  const { data: lesson } = useLesson(lessonId);
  const { data: course } = useCourse(courseId);

  if (!lesson) return null;

  return (
    <PageWrapper className="max-w-full h-full">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] h-full max-w-full gap-6 w-full">
        <div className="w-full bg-white rounded-lg flex flex-col h-full divide-y">
          <div className="flex items-center py-6 px-12">
            <p className="h6 text-neutral-950">
              <span className="text-neutral-800">Chapter 1:</span> {course?.title}
            </p>
          </div>
          <LessonContent lesson={lesson} handlePrevious={() => noop} handleNext={() => noop} />
        </div>
        <div className="w-full bg-white h-full rounded-lg">
          <div className="flex flex-col gap-y-12">
            <div className="flex flex-col gap-y-4 px-8 pt-8">
              <div className="flex justify-between">
                <CategoryChip category="Data Science" className="bg-primary-50 body-sm-md" />
              </div>
              <h1 className="h6 text-neutral-950">
                Mastering Data Analytics: From Fundamentals to Advanced Techniques
              </h1>
              <CourseProgress
                label="Course progress:"
                completedLessonCount={1}
                courseLessonCount={10}
              />
            </div>
            <div className="flex flex-col px-4 gap-y-4">
              <p>Table of content:</p>
              <div className="flex flex-col">
                <Accordion type="single" collapsible>
                  {course?.chapters?.map(({ id, title, lessons }) => {
                    return (
                      <AccordionItem value={id} key={id}>
                        <AccordionTrigger className="flex hover:bg-neutral-50 gap-x-4 px-6 py-4 text-start [&[data-state=open]>div>div>svg]:rotate-180 [&[data-state=open]>div>div>svg]:duration-200 [&[data-state=open]>div>div>svg]:ease-out data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg data-[state=open]:border-primary-500 data-[state=open]:bg-primary-50 border">
                          <Icon name="InputRoundedMarkerSuccess" className="size-6" />
                          <div className="body-base-md text-neutral-950 text-start w-full">
                            {title}
                          </div>
                          <div className="grid place-items-center w-8 h-8">
                            <Icon name="CarretDownLarge" className="w-6 h-auto text-primary-700" />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col divide-y border-b">
                          {lessons?.map(({ id, title, status, type }) => {
                            return (
                              <Link
                                key={id}
                                to={`/course/${courseId}/lesson/${id}`}
                                className={cn(
                                  "flex gap-x-4 py-2 px-6 border-x hover:bg-neutral-50",
                                  {
                                    "bg-primary-50 border-l-2 border-primary-600":
                                      status === "completed",
                                  },
                                )}
                              >
                                <Badge variant="icon" icon="InputRoundedMarkerSuccess" />
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
      </div>
    </PageWrapper>
  );
}
