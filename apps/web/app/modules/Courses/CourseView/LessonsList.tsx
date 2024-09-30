import { Link } from "@remix-run/react";
import type { GetCourseResponse } from "~/api/generated-api";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { CaretRight } from "~/assets/svgs";
import { useUserRole } from "~/hooks/useUserRole";

type LessonsListProps = {
  lessons: GetCourseResponse["data"]["lessons"];
  isEnrolled: GetCourseResponse["data"]["enrolled"];
};

export const LessonsList = ({ lessons, isEnrolled }: LessonsListProps) => {
  const { isAdmin } = useUserRole();

  return (
    <div className="grow flex flex-col rounded-2xl bg-white drop-shadow-primary relative p-8">
      <h3 className="text-xl font-semibold mb-4">
        Lessons
        <span className="text-primary-700"> ({lessons.length})</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 overflow-auto min-h-0">
        {lessons.map(({ description, imageUrl, title, id }, index) => (
          <Card
            key={index}
            className={cn("w-full transition border-primary-200", {
              "hover:border-primary-500": isEnrolled,
              "opacity-60 cursor-not-allowed": !isEnrolled,
            })}
          >
            <CardContent className="p-4 h-full">
              <Link to={`lesson/${id}`} className="flex flex-col h-full gap-4">
              <div className="relative">
                <img
                  src={imageUrl ?? "https://placehold.co/600x400"}
                  alt={`Lesson ${index + 1}`}
                  className="w-full object-cover object-center rounded-lg drop-shadow-sm aspect-video"
                />
                <span className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-1/2 bg-white rounded-full w-8 h-8 flex justify-center items-center text-primary-700">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col h-full bg-white w-full">
                    <div className="gap-2 flex flex-col">
                      <p className="text-neutral-600 text-xs">
                        Lesson progress: 2/10
                      </p>
                      <div className="flex justify-between items-center gap-px">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <span
                            key={index}
                            className="h-[5px] flex-grow bg-secondary-500 rounded-[40px]"
                          />
                        ))}
                        {Array.from({
                          length: 8,
                        }).map((_, index) => (
                          <span
                            key={index}
                            className="h-[5px] flex-grow bg-primary-50 rounded-[40px]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2 pb-4">
                  <h4 className="font-medium text-sm text-neutral-950 mt-2">
                    {title}
                  </h4>
                  <p className="text-xs text-neutral-900 mt-1 line-clamp-3 flex-grow leading-5">
                    {description}
                  </p>
                </div>
                <Link
                  to={`lesson/${id}`}
                  className="text-primary-700 text-xs mt-auto self-start font-medium"
                >
                  {isAdmin ? (
                    "Lesson preview"
                  ) : isEnrolled ? (
                    <>
                      Read more{" "}
                      <CaretRight className="w-3 h-3 inline-block text-primary-700" />
                    </>
                  ) : null}
                </Link>
              </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
