import { useTranslation } from "react-i18next";

import { Icon } from "~/components/Icon";

const CourseLessonEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 size-full">
      <Icon name="CourseEmptyState" />
      <div className="text-center flex flex-col gap-y-2">
        <h2 className="text-neutral-950 h6">{t("adminCourseView.curriculum.emptyState.header")}</h2>
        <p className="text-neutral-800 body-base">
          {t("adminCourseView.curriculum.emptyState.subHeader")}
        </p>
      </div>
    </div>
  );
};

export default CourseLessonEmptyState;
