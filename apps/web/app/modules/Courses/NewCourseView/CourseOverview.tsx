import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import Viewer from "~/components/RichText/Viever";
import { Card, CardContent } from "~/components/ui/card";
import { CategoryChip } from "~/components/ui/CategoryChip";

import type { GetCourseResponse } from "~/api/generated-api";

type CourseOverviewProps = {
  course: GetCourseResponse["data"];
};

export default function CourseOverview({ course }: CourseOverviewProps) {
  const imageUrl = course?.thumbnailUrl ?? CardPlaceholder;
  const title = course?.title;
  const description = course?.description || "";

  return (
    <Card className="w-full pt-6 lg:pt-0 border-none drop-shadow-primary">
      <CardContent className="lg:p-8 flex flex-col align-center gap-6 2xl:flex-row">
        <div className="relative self-center w-full lg:max-w-[320px] aspect-video">
          <img
            src={imageUrl}
            alt={title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover rounded-lg drop-shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = CardPlaceholder;
            }}
          />
        </div>
        <div className="flex flex-col w-full gap-y-2">
          <CategoryChip category={course?.category} className="bg-primary-50" />
          <h5 className="h5">{title}</h5>
          <Viewer content={description} className="body-base text-neutral-900 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}
