import { startCase } from "lodash-es";
import { match } from "ts-pattern";

import { Icon } from "~/components/Icon";
import Viewer from "~/components/RichText/Viever";
import { Button } from "~/components/ui/button";
import { VideoPlayer } from "~/components/VideoPlayer/VideoPlayer";

import Presentation from "../../../components/Presentation/Presentation";

import type { GetLessonByIdResponse } from "~/api/generated-api";

type LessonContentProps = {
  lesson: GetLessonByIdResponse["data"];
  handlePrevious: () => void;
  handleNext: () => void;
};

export const LessonContent = ({ lesson, handlePrevious, handleNext }: LessonContentProps) => {
  const Content = () =>
    match(lesson.type)
      .with("text_block", () => <Viewer variant="lesson" content={lesson?.description} />)
      .with("quiz", () => <></>)
      .with("video", () => <VideoPlayer url={lesson.fileUrl} />)
      .with("presentation", () => (
        <Presentation
          url={lesson.fileUrl}
          presentationId={""}
          isAdmin={false}
          isCompleted={false}
          lessonItemId={""}
          updateLessonItemCompletion={function (lessonItemId: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      ))
      .otherwise(() => null);

  return (
    <div className="flex flex-col py-6 w-full items-center">
      <div className="flex flex-col gap-y-8 max-w-[1024px] w-full">
        <div className="flex w-full items-end">
          <div className="flex flex-col gap-y-2 w-full">
            <p className="body-sm-md text-neutral-800">
              Lesson {2}/{10} - {startCase(lesson.type)}
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
      </div>
    </div>
  );
};
