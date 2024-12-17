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
      defaultValue={searchParams.get("tab") ?? "Settings"}
      className="flex flex-col gap-y-4 h-full"
    >
      <div className="py-6 px-8 flex flex-col gap-y-4 shadow-md w-full border bg-white rounded-lg border-gray-200">
        <h4 className="text-neutral-950 h4 flex items-center">
          {course?.title || ""}
          {!course?.isPublished && (
            <span className="ml-2 flex items-center text-yellow-600 bg-warning-50 px-2 py-1 rounded-sm text-sm">
              <Icon name="Warning" className="mr-1" />
              Draft
            </span>
          )}
        </h4>
        <TabsList className="w-min">
          {["Settings", "Lesson", "Pricing", "Status"].map((tab) => (
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
          imageUrl={course?.thumbnailUrl}
        />
      </TabsContent>
      <TabsContent value="Lesson" className="h-full overflow-hidden">
        <CourseLessons
          chapters={course?.chapters as Chapter[]}
          canRefetchChapterList={!!canRefetchChapterList}
        />
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
