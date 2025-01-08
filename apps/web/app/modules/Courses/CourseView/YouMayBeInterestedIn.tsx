import { isEmpty } from "lodash-es";
import { useTranslation } from "react-i18next";

import { useAvailableCourses } from "~/api/queries";
import { Icon } from "~/components/Icon";
import Loader from "~/modules/common/Loader/Loader";
import { CoursesCarousel } from "~/modules/Dashboard/Courses/CoursesCarousel";

type YouMayBeInterestedInProps = {
  category: string;
  courseId: string;
};

export const YouMayBeInterestedIn = ({ category, courseId }: YouMayBeInterestedInProps) => {
  const { data: relatedCourses, isLoading } = useAvailableCourses({
    category,
    excludeCourseId: courseId,
  });
  const { t } = useTranslation();

  if (!relatedCourses?.length) return null;

  return (
    <section className="flex flex-col gap-y-6 w-full h-full bg-white p-8 rounded-lg">
      <div className="flex flex-col">
        <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">
          {t('studentCourseView.recommendedHeader')}
        </h4>
        <p className="text-lg leading-7 text-neutral-800">
        {t('studentCourseView.recommendedSubheader')}
        </p>
      </div>
      <div data-testid="enrolled-courses" className="flex gap-6w-full">
        {!relatedCourses ||
          (isEmpty(relatedCourses) && (
            <div className="col-span-3 flex gap-8">
              <div>
                <Icon name="EmptyCourse" className="mr-2 text-neutral-900" />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-lg font-bold leading-5 text-neutral-950">
                  {t('studentCourseView.other.cannotFindCourses')}
                </p>
                <p className="text-neutral-800 text-base leading-6 font-normal">
                {t('studentCourseView.other.changeSearchCriteria')}
                </p>
              </div>
            </div>
          ))}
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        )}
        <CoursesCarousel courses={relatedCourses} />
      </div>
    </section>
  );
};
