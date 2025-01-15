import { useParams, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { useBetaCourseById } from "~/api/queries/admin/useBetaCourse";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { LeaveModalProvider } from "~/context/LeaveModalContext";
import { useTrackDataUpdatedAt } from "~/hooks/useTrackDataUpdatedAt";

import CourseLessons from "./CourseLessons/CourseLessons";
import CoursePricing from "./CoursePricing/CoursePricing";
import CourseSettings from "./CourseSettings/CourseSettings";
import CourseStatus from "./CourseStatus/CourseStatus";

import type { Chapter } from "./EditCourse.types";

const EditCourse = () => {
  const { t } = useTranslation();
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
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={searchParams.get("tab") ?? "Curriculum"}
      className="flex h-full flex-col gap-y-4"
    >
      <div className="flex w-full flex-col gap-y-4 rounded-lg border border-gray-200 bg-white px-8 py-6 shadow-md">
        <div className="flex items-center justify-between">
          <h4 className="h4 flex items-center text-neutral-950">
            {course?.title || ""}
            {course?.isPublished ? (
              <span className="text-success-800 bg-success-50 ml-2 flex items-center rounded-sm px-2 py-1 text-sm">
                <Icon name="Success" className="mr-1" />
                {t("common.other.published")}
              </span>
            ) : (
              <span className="bg-warning-50 ml-2 flex items-center rounded-sm px-2 py-1 text-sm text-yellow-600">
                <Icon name="Warning" className="mr-1" />
                {t("common.other.draft")}
              </span>
            )}
          </h4>
          <Button className="text-primary-700 flex justify-end border border-neutral-200 bg-transparent">
            <Icon name="Eye" className="mr-2" />
            {t("adminCourseView.common.preview")}{" "}
            <Icon name="ArrowDown" className="ml-2 text-neutral-500" />
          </Button>
        </div>
        <TabsList className="w-min">
          {[
            { label: t("adminCourseView.common.settings"), value: "Settings" },
            { label: t("adminCourseView.common.curriculum"), value: "Curriculum" },
            { label: t("adminCourseView.common.pricing"), value: "Pricing" },
            { label: t("adminCourseView.common.status"), value: "Status" },
          ].map(({ label, value }) => (
            <TabsTrigger key={value} value={value} onClick={() => handleTabChange(value)}>
              {label}
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
