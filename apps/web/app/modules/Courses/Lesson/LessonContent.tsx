import { startCase } from "lodash-es";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

import { useMarkLessonAsCompleted } from "~/api/mutations";
import { Icon } from "~/components/Icon";
import Viewer from "~/components/RichText/Viever";
import { Button } from "~/components/ui/button";
import { VideoPlayer } from "~/components/VideoPlayer/VideoPlayer";

import Presentation from "../../../components/Presentation/Presentation";

import type { GetLessonByIdResponse } from "~/api/generated-api";

type LessonContentProps = {
  lesson: GetLessonByIdResponse["data"];
  lessonsAmount: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isFirstLesson: boolean;
  isLastLesson: boolean;
};

export const LessonContent = ({
  lesson,
  lessonsAmount,
  handlePrevious,
  handleNext,
  isFirstLesson,
  isLastLesson,
}: LessonContentProps) => {
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const { mutate: markLessonAsCompleted } = useMarkLessonAsCompleted();

  useEffect(() => {
    if (lesson.type === "video") setIsNextDisabled(true);
  }, [lesson.type]);

  const Content = () =>
    match(lesson.type)
      .with("text", () => <Viewer variant="lesson" content={lesson?.description} />)
      .with("quiz", () => <></>)
      .with("video", () => (
        <VideoPlayer url={lesson.fileUrl} onVideoEnded={() => setIsNextDisabled(false)} />
      ))
      .with("presentation", () => <Presentation url={lesson.fileUrl ?? ""} />)
      .otherwise(() => null);

  const handleMarkLessonAsComplete = () => {
    handleNext();
    markLessonAsCompleted({ lessonId: lesson.id });
  };

  return (
    <div className="flex flex-col py-6 h-full w-full items-center">
      <div className="flex flex-col h-full gap-y-8 px-8 3xl:p-0 3xl:max-w-[1024px] w-full">
        <div className="flex w-full items-end">
          <div className="flex flex-col gap-y-2 w-full">
            <p className="body-sm-md text-neutral-800">
              Lesson {lesson.displayOrder}/{lessonsAmount} - {startCase(lesson.type)}
            </p>
            <p className="h4 text-neutral-950">{lesson.title}</p>
          </div>
          <div className="flex gap-x-3">
            {!isFirstLesson && (
              <Button variant="outline" className="gap-x-1" onClick={handlePrevious}>
                <Icon name="ArrowRight" className="rotate-180 w-4 h-auto" />
                <span>Previous</span>
              </Button>
            )}

            <Button
              className="gap-x-1"
              disabled={isNextDisabled}
              onClick={handleMarkLessonAsComplete}
            >
              <Icon name="ArrowRight" className="w-4 h-auto" />
              <span>{isLastLesson ? "Complete" : "Next"}</span>
            </Button>
          </div>
        </div>
        <Content />
      </div>
    </div>
  );
};
