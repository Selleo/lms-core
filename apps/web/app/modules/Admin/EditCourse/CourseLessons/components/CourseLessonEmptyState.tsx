import { useTranslation } from "react-i18next";

import { Icon } from "~/components/Icon";

const CourseLessonEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex size-full flex-col items-center justify-center gap-y-8">
      <Icon name="CourseEmptyState" />
      <div className="flex flex-col gap-y-2 text-center">
        <h2 className="h6 text-neutral-950">{t("adminCourseView.curriculum.emptyState.header")}</h2>
        <p className="body-base text-neutral-800">
          {t("adminCourseView.curriculum.emptyState.subHeader")}
        </p>
      </div>
    </div>
  );
};

export default CourseLessonEmptyState;
