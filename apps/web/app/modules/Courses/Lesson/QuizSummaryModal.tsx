import { Link } from "@remix-run/react";

import CourseStartedImage from "~/assets/course-started.png";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type QuizSummaryModalProps = {
  courseId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  scoreLabel: string;
};

export const QuizSummaryModal = ({
  courseId,
  isOpen,
  setIsOpen,
  scoreLabel,
}: QuizSummaryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[368px]">
        <div className="flex flex-col gap-y-4">
          <div className="w-full bg-neutral-50 rounded-lg flex justify-center">
            <img src={CourseStartedImage} alt="" className="w-[220px] h-auto aspect-square" />
          </div>
          <div className="flex flex-col-reverse items-center gap-y-2">
            <DialogTitle>
              <hgroup className="text-center">
                <h2 className="font-bold text-lg text-neutral-950">Congratulations!</h2>
                <p className="body-base font-normal text-neutral-800">You are finished the quiz.</p>
              </hgroup>
            </DialogTitle>
            <DialogDescription className="flex items-center gap-x-1 mb-1 text-neutral-950 bg-neutral-50 py-1 px-2 rounded-lg">
              <Icon name="QuizStar" />
              <span className="body-sm-md">Your Score: {scoreLabel}</span>
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-y-2">
            <DialogTrigger asChild>
              <Button variant="outline">Try Again</Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Link to={`/course/${courseId}/`}>
                <Button className="w-full">Back to Course</Button>
              </Link>
            </DialogTrigger>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
