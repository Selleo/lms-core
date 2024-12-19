import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ContentTypes, LessonType } from "../../../EditCourse.types";

type BreadrumbProps = {
  lessonLabel: string;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

const Breadcrumb = ({ lessonLabel, setContentTypeToDisplay }: BreadrumbProps) => {
  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink
          onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
          className="text-primary-800 body-base-md cursor-pointer"
        >
          Back
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          onClick={() => setContentTypeToDisplay(ContentTypes.SELECT_LESSON_TYPE)}
          className="text-neutral-850 body-base-md cursor-pointer"
        >
          Choose type
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem className="text-neutral-950 body-base-md">{lessonLabel}</BreadcrumbItem>
    </BreadcrumbList>
  );
};

export default Breadcrumb;
