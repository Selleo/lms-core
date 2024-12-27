import { useParams, useSearchParams } from "@remix-run/react";

import { useBetaCourseById } from "~/api/queries/admin/useBetaCourse";
import { Icon } from "~/components/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTrackDataUpdatedAt } from "~/hooks/useTrackDataUpdatedAt";

import CourseLessons from "./CourseLessons/CourseLessons";
import CoursePricing from "./CoursePricing/CoursePricing";
import CourseSettings from "./CourseSettings/CourseSettings";
import CourseStatus from "./CourseStatus/CourseStatus";

import type { Chapter } from "./EditCourse.types";
import { Button } from "~/components/ui/button";
import { LeaveModalProvider } from "~/context/LeaveModalContext";

const EditCourse = () => {
  const { id } = useParams();
  const params = new URLSearchParams();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!id) throw new Error("Course ID not found");
  const { data: course, isLoading, dataUpdatedAt } = useBetaCourseById(id);
  const { previousDataUpdatedAt, currentDataUpdatedAt } = useTrackDataUpdatedAt(dataUpdatedAt);
  const handleTabChange = (tabValue: string) => {
    params.set("tab", tabValue);
    setSearchParams(params);
  };

  const canRefetchChapterList =
    previousDataUpdatedAt && currentDataUpdatedAt && previousDataUpdatedAt < currentDataUpdatedAt;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={searchParams.get("tab") ?? "Curriculum"}
      className="flex flex-col gap-y-4 h-full"
    >
      <div className="py-6 px-8 flex flex-col gap-y-4 shadow-md w-full border bg-white rounded-lg border-gray-200">
        <div className="flex justify-between items-center">
          <h4 className="text-neutral-950 h4 flex items-center">
            {course?.title || ""}
            {course?.isPublished ? (
              <span className="ml-2 flex items-center text-success-800 bg-success-50 px-2 py-1 rounded-sm text-sm">
                <Icon name="Success" className="mr-1" />
                Published
              </span>
            ) : (
              <span className="ml-2 flex items-center text-yellow-600 bg-warning-50 px-2 py-1 rounded-sm text-sm">
                <Icon name="Warning" className="mr-1" />
                Draft
              </span>
            )}
          </h4>
          <Button className="bg-transparent text-primary-700 border border-neutral-200 flex justify-end">
            <Icon name="Eye" className="mr-2" />
            Preview <Icon name="ArrowDown" className="text-neutral-500 ml-2" />
          </Button>
        </div>
        <TabsList className="w-min">
          {["Settings", "Curriculum", "Pricing", "Status"].map((tab) => (
            <TabsTrigger key={tab} value={tab} onClick={() => handleTabChange(tab)}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="Settings">
        <CourseSettings
          courseId={course?.id || ""}
          title={course?.title}
          description={course?.description}
          categoryId={course?.categoryId}
          thumbnailS3SingedUrl={course?.thumbnailS3SingedUrl}
          thumbnailS3Key={course?.thumbnailS3Key}
        />
      </TabsContent>
      <TabsContent value="Curriculum" className="h-full overflow-hidden">
        <LeaveModalProvider>
          <CourseLessons
            chapters={course?.chapters as Chapter[]}
            canRefetchChapterList={!!canRefetchChapterList}
          />
        </LeaveModalProvider>
      </TabsContent>
      <TabsContent value="Pricing">
        <CoursePricing
          courseId={course?.id || ""}
          currency={course?.currency}
          priceInCents={course?.priceInCents}
        />
      </TabsContent>
      <TabsContent value="Status">
        <CourseStatus courseId={course?.id || ""} isPublished={!!course?.isPublished} />
      </TabsContent>
    </Tabs>
  );
};

export default EditCourse;
