import { ProgressBadge } from "~/components/Badges/ProgressBadge";
import { CardBadge } from "~/components/CardBadge";
import { Icon } from "~/components/Icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";

const cardBadgeVariant: Record<string, "successOutlined" | "secondaryFilled" | "default"> = {
  completed: "successOutlined",
  in_progress: "secondaryFilled",
  not_started: "default",
};

const cardBadgeIcon = {
  completed: "InputRoundedMarkerSuccess",
  inProgress: "InProgress",
  not_started: "NotStartedRounded",
} as const;

const lessonProgress = "inProgress";

export const CourseChapterLesson = ({ isSuccess }: { isSuccess: boolean }) => {
  return (
    <div className="flex gap-x-2 w-full p-2">
      <Icon name="Video" className="size-6 text-primary-700" />
      <div className="flex flex-col justify-center w-full">
        <p className="body-sm-md text-neutral-950">
          Introduction <span className="text-neutral-800">(8)</span>
        </p>
        <span className="text-neutral-800 details">Video</span>
      </div>
      <ProgressBadge progress={isSuccess ? "completed" : "inProgress"} className="self-center" />
    </div>
  );
};

export const CourseChapter = ({ isSuccess }: { isSuccess: boolean }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <div className="flex gap-x-4 w-full">
          <div className="flex flex-col items-center gap-y-1">
            {isSuccess ? (
              <>
                <div className="grid place-items-center p-2 rounded-full bg-success-50">
                  <Icon name="InputRoundedMarkerSuccess" />
                </div>
                <div className="w-0.5 h-full bg-success-200" />
              </>
            ) : (
              <>
                <div className="grid place-items-center p-2 rounded-full bg-secondary-50">
                  <Icon name="InProgress" />
                </div>
                <div className="w-0.5 h-full bg-secondary-200" />
              </>
            )}
          </div>
          <div className="flex flex-col w-full">
            <AccordionTrigger className="text-start [&[data-state=open]>div>div>svg]:rotate-180 [&[data-state=open]>div>div>svg]:duration-200 [&[data-state=open]>div>div>svg]:ease-out data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg data-[state=open]:border-primary-500 data-[state=open]:bg-primary-50 border">
              <div className="w-full gap-x-4 p-4 flex items-center">
                <div className="grid place-items-center w-8 h-8">
                  <Icon name="CaretDown" className="w-6 text-primary-700" />
                </div>
                <div className="flex flex-col w-full">
                  <div className="details text-neutral-800">3 Lessons - 2 Quizzes</div>
                  <p className="body-base-md text-neutral-950">
                    Introduction to Data Analytics and its Applications
                  </p>
                  <div className="flex gap-x-1 items-center details text-neutral-800">
                    <span className="pr-2">5/5</span>
                    {Array.from({ length: 5 }).map((_, index) => {
                      if (isSuccess) {
                        return (
                          <span key={index} className="h-1 w-20 bg-success-500 rounded-lg"></span>
                        );
                      }
                      return (
                        <span key={index} className="h-1 w-20 bg-secondary-500 rounded-lg"></span>
                      );
                    })}
                  </div>
                </div>
                <CardBadge variant="successFilled">
                  <Icon name="FreeRight" className="w-4" />
                  Free
                </CardBadge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y pl-14 divide-neutral-200 pt-3 pb-4 rounded-b-lg border-b border-x border-primary-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CourseChapterLesson key={index} isSuccess={isSuccess} />
                ))}
                <Button className="mt-3 gap-x-2">
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
                  <span>Continue</span>
                </Button>
              </div>
            </AccordionContent>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};
