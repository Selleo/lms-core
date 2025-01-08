import { useCallback, useEffect, useState } from "react";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { useLeaveModal } from "~/context/LeaveModalContext";

import { ContentTypes } from "../../../EditCourse.types";

import type { Lesson } from "../../../EditCourse.types";
import { useTranslation } from "react-i18next";


type BreadrumbProps = {
  lessonLabel: string;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  setSelectedLesson: (selectedLesson: Lesson | null) => void;
};

const Breadcrumb = ({
  lessonLabel,
  setContentTypeToDisplay,
  setSelectedLesson,
}: BreadrumbProps) => {
  const { isCurrentFormDirty, setIsLeavingContent, openLeaveModal } = useLeaveModal();
  const [isEmptyStateClicked, setIsEmptyStateClicked] = useState(false);
  const [isChooseTypeClicked, setIsChooseTypeClicked] = useState(false);
  const { t } = useTranslation();

  const onClickBack = useCallback(() => {
    if (isCurrentFormDirty) {
      setIsLeavingContent(true);
      setIsEmptyStateClicked(true);
      openLeaveModal();
      return;
    }
    setContentTypeToDisplay(ContentTypes.EMPTY);
    setSelectedLesson(null);
  }, [
    isCurrentFormDirty,
    setIsLeavingContent,
    setIsEmptyStateClicked,
    openLeaveModal,
    setContentTypeToDisplay,
  ]);

  const onClickChooseType = useCallback(() => {
    if (isCurrentFormDirty) {
      setIsLeavingContent(true);
      setIsChooseTypeClicked(true);
      openLeaveModal();
      return;
    }
    setContentTypeToDisplay(ContentTypes.SELECT_LESSON_TYPE);
    setSelectedLesson(null);
  }, [
    isCurrentFormDirty,
    setIsLeavingContent,
    setIsChooseTypeClicked,
    openLeaveModal,
    setContentTypeToDisplay,
  ]);

  useEffect(() => {
    if (!isCurrentFormDirty && isEmptyStateClicked) {
      onClickBack();
      setIsEmptyStateClicked(false);
      setIsLeavingContent(false);
    }
  }, [isCurrentFormDirty, isEmptyStateClicked, onClickBack]);

  useEffect(() => {
    if (!isCurrentFormDirty && isChooseTypeClicked) {
      onClickChooseType();
      setIsChooseTypeClicked(false);
      setIsLeavingContent(false);
    }
  }, [isCurrentFormDirty, isChooseTypeClicked, onClickChooseType]);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink
          onClick={onClickBack}
          className="text-primary-800 body-base-md cursor-pointer"
        >
          {t("adminCourseView.curriculum.lesson.breadcrumbs.back")}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          onClick={onClickChooseType}
          className="text-neutral-850 body-base-md cursor-pointer"
        >
          {t("adminCourseView.curriculum.lesson.other.chooseType")}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem className="text-neutral-950 body-base-md">{lessonLabel}</BreadcrumbItem>
    </BreadcrumbList>
  );
};

export default Breadcrumb;
