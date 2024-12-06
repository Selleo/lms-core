import { Icon } from "~/components/Icon";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { ContentTypes } from "../../../EditCourse.types";

import type { LessonIcons } from "../../../EditCourse.types";

type SelectLessonTypeProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

const lessonTypes = [
  {
    type: ContentTypes.TEXT_LESSON_FORM,
    icon: "Text",
    title: "Text",
    description: "This type allows you to create text-based content via a rich text editor.",
  },
  {
    type: ContentTypes.VIDEO_LESSON_FORM,
    icon: "Video",
    title: "Video",
    description: "Choose this type if you want to embed video content files like MP4.",
  },
  {
    type: ContentTypes.PRESENTATION_FORM,
    icon: "Presentation",
    title: "Presentation",
    description: "Choose this type if you want to embed presentations files like PPTX.",
  },
  // {
  //   type: ContentTypes.EMPTY,
  //   icon: "Quiz",
  //   title: "Quiz",
  //   description: "This type allows you to build quizzes for your chapter using different types of questions.",
  // },
];

const SelectLessonType = ({ setContentTypeToDisplay }: SelectLessonTypeProps) => {
  return (
    <div className="w-full max-w-full">
      <Card className="w-full max-w-full p-6 rounded-lg shadow-lg border">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Choose type:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lessonTypes.map(({ type, icon, title, description }) => (
            <Card
              key={type}
              className={cn(
                "p-6 shadow-sm hover:shadow-md transition rounded-md border cursor-pointer",
              )}
              onClick={() => setContentTypeToDisplay(type)}
              aria-label={`Choose ${title} lesson type`}
            >
              <Icon name={icon as LessonIcons} className="mb-6" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-l text-gray-500 mt-2">{description}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SelectLessonType;
