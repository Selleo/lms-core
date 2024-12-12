import { CourseDetailsStep } from "../components/CourseDetailsStep";
import { PricingStep } from "../components/PricingStep";
import { ScormUploadStep } from "../components/ScormUploadStep";
import { StatusStep } from "../components/StatusStep";

export const STEPS = [
  {
    id: "upload",
    title: "Upload SCORM",
    description:
      "Upload your .zip file in SCORM format. You'll have more options to customize the course later.",
    Component: ScormUploadStep,
  },
  {
    id: "details",
    title: "Course Details",
    description:
      "Upload your .zip file in SCORM format. You'll have more options to customize the course later.",
    Component: CourseDetailsStep,
  },
  {
    id: "pricing",
    title: "Pricing",
    description:
      "Upload your .zip file in SCORM format. You'll have more options to customize the course later.",
    Component: PricingStep,
  },
  {
    id: "status",
    title: "Status",
    description:
      "Upload your .zip file in SCORM format. You'll have more options to customize the course later.",
    Component: StatusStep,
  },
] as const;
