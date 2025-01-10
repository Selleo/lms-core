import { useEffect, useState } from "react";

import { useCategoriesSuspense } from "~/api/queries";
import { Icon } from "~/components/Icon";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";
import CourseCard from "~/modules/Dashboard/Courses/CourseCard";

import { CourseDetailsStep } from "./components/CourseDetailsStep";
import { PricingStep } from "./components/PricingStep";
import { ScormUploadStep } from "./components/ScormUploadStep";
import { StatusStep } from "./components/StatusStep";
import { useScormFormStore } from "./store/scormForm.store";

import type { CourseCardProps } from "~/modules/Dashboard/Courses/CourseCard";

type SideComponentProps =
  | {
      className?: string;
    }
  | (CourseCardProps & { className?: string });

export const SCORM_CONFIG = [
  {
    id: "upload",
    title: "Upload SCORM",
    description: "Upload your SCORM .zip file.",
    Component: ScormUploadStep,
    SideComponent: ({ className }: SideComponentProps) => (
      <Icon name="UploadIllustration" className={className} />
    ),
  },
  {
    id: "details",
    title: "Set up Course",
    description: "Provide the details to set up a new course.",
    Component: CourseDetailsStep,
    SideComponent: (props: SideComponentProps) => {
      const { data: categories } = useCategoriesSuspense();

      const { currentUser: { email, firstName, lastName } = {} } = useCurrentUserStore.getState();
      const {
        formData: { details: { title, description, category: categoryId, thumbnail } = {} },
      } = useScormFormStore.getState();

      const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

      useEffect(() => {
        if (thumbnail) {
          const url = URL.createObjectURL(thumbnail);
          setThumbnailUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      }, [thumbnail]);

      const categoryName = categories.find((category) => category.id === categoryId)?.title;

      return (
        <CourseCard
          id={"scorm-card"}
          title={title || "Untitled..."}
          thumbnailUrl={thumbnailUrl ?? ""}
          description={description || "No description yet."}
          author={`${firstName} ${lastName}`}
          authorEmail={email ?? ""}
          category={categoryName ?? ""}
          courseChapterCount={0}
          completedChapterCount={0}
          enrolledParticipantCount={0}
          priceInCents={0}
          currency={""}
          {...props}
        />
      );
    },
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Set pricing for the course",
    Component: PricingStep,
    SideComponent: ({ className }: SideComponentProps) => (
      <Icon name="PricingIllustration" className={className} />
    ),
  },
  {
    id: "status",
    title: "Status",
    description: "Set status for the course",
    Component: StatusStep,
    SideComponent: ({ className }: SideComponentProps) => (
      <Icon name="StatusIllustration" className={className} />
    ),
  },
] as const;
