import { Icon } from "~/components/Icon";

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
  {
    type: ContentTypes.QUIZ_FORM,
    icon: "Quiz",
    title: "Quiz",
    description:
      "This type allows you to build quizzes for your chapter using different types of questions.",
  },
];

const SelectLessonType = ({ setContentTypeToDisplay }: SelectLessonTypeProps) => {
  return (
    <div className="flex flex-col p-8 gap-y-6 bg-white">
      <h3 className="h5 text-neutral-950">Choose type:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {lessonTypes.map(({ type, icon, title, description }) => {
          return (
            <div
              key={type}
              className="px-6 border border-neutral-200 rounded-lg py-4 flex flex-col gap-y-6 hover:border-primary-500"
              role="button"
              onClick={() => setContentTypeToDisplay(type)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setContentTypeToDisplay(type);
                }
              }}
              tabIndex={0}
              aria-label={`Choose ${title} lesson type`}
            >
              <Icon name={icon as LessonIcons} className="mb-6 size-8 text-primary-700" />
              <hgroup className="flex flex-col gap-y-3">
                <h3 className="h6 text-neutral-950">{title}</h3>
                <p className="body-sm text-neutral-800">{description}</p>
              </hgroup>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectLessonType;
