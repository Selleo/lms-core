import { CustomDropdown } from "../CustomDropdown";

export const LessonItemsButton = () => {
  return (
    <CustomDropdown
      buttonText="New"
      buttonVariant="default"
      items={[
        {
          label: "Video Lesson",
          href: "add/video",
        },
        {
          label: "Written Lesson",
          href: "add/text",
        },
      ]}
    />

  );
};
