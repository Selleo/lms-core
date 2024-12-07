import { useParams } from "@remix-run/react";
import { useState } from "react";

import { useBetaCourseById } from "~/api/queries/admin/useBetaCourse";
import { Icon } from "~/components/Icon";
import { Card, CardHeader, CardContent } from "~/components/ui/card";

import NavigationTabs from "./compontents/NavigationTabs";
import CourseLessons from "./CourseLessons/CourseLessons";
import CoursePricing from "./CoursePricing/CoursePricing";
import CourseSettings from "./CourseSettings/CourseSettings";
import CourseStatus from "./CourseStatus/CourseStatus";

import type { Chapter, NavigationTab } from "./EditCourse.types";

const EditCourse = () => {
  const [navigationTabState, setNavigationTabState] = useState<NavigationTab>("Lesson");
  const { id } = useParams();
  if (!id) throw new Error("Course ID not found");
  const { data: course, isLoading } = useBetaCourseById(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (navigationTabState) {
      case "Settings":
        return (
          <CourseSettings
            courseId={course?.id || ""}
            title={course?.title}
            description={course?.description}
            categoryId={course?.categoryId}
            imageUrl={course?.imageUrl}
          />
        );
      case "Lesson":
        return <CourseLessons chapters={course?.lessons as Chapter[]} />;
      case "Pricing":
        return (
          <CoursePricing
            courseId={course?.id || ""}
            currency={course?.currency}
            priceInCents={course?.priceInCents}
          />
        );
      case "Status":
        return <CourseStatus courseId={course?.id || ""} state={course?.state || "draft"} />;
      default:
        return <div className="text-gray-700 text-lg">Select a tab to view content.</div>;
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1 flex items-center">
            {course?.title || ""}
            {course?.state === "draft" && (
              <span className="ml-2 flex items-center text-yellow-600 bg-warning-50 px-2 py-1 rounded-sm text-sm">
                <Icon name="Warning" className="mr-1" />
                Draft
              </span>
            )}
          </h4>
        </CardHeader>
        <CardContent>
          <NavigationTabs setNavigationTabState={setNavigationTabState} />
        </CardContent>
      </Card>

      <div className="mt-6">{renderContent()}</div>
    </div>
  );
};

export default EditCourse;
