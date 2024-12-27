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
};

export const LessonContent = ({
  lesson,
  lessonsAmount,
  handlePrevious,
  handleNext,
}: LessonContentProps) => {
  const [isCompleteDisabled, setIsCompleteDisabled] = useState(false);
  const { mutate: markLessonAsCompleted } = useMarkLessonAsCompleted();

  useEffect(() => {
    if (lesson.type === "video") setIsCompleteDisabled(true);
  }, [lesson.type]);

  const Content = () =>
    match(lesson.type)
      .with("text", () => <Viewer variant="lesson" content={lesson?.description} />)
      .with("quiz", () => <></>)
      .with("video", () => (
        <VideoPlayer url={lesson.fileUrl} onVideoEnded={() => setIsCompleteDisabled(false)} />
      ))
      .with("presentation", () => <Presentation url={lesson.fileUrl ?? ""} />)
      .otherwise(() => null);

  const handleMarkLessonAsComplete = () => {
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
            <Button variant="outline" className="gap-x-1" onClick={handlePrevious}>
              <Icon name="ArrowRight" className="rotate-180 w-4 h-auto" />
              <span>Previous</span>
            </Button>
            <Button className="gap-x-1" onClick={handleNext}>
              <Icon name="ArrowRight" className="w-4 h-auto" />
              <span>Next</span>
            </Button>
          </div>
        </div>
        <Content />
        <footer className="sticky bottom-0 border-t border-neutral-200 left-0 w-full py-4 grid place-items-center">
          <Button onClick={handleMarkLessonAsComplete} disabled={isCompleteDisabled}>
            Complete <Icon name="ArrowRight" className="w-4 h-auto" />
          </Button>
        </footer>
      </div>
    </div>
  );
};
