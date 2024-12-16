import { Icon } from "~/components/Icon";

const CourseLessonEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 size-full">
      <Icon name="CourseEmptyState" />
      <div className="text-center flex flex-col gap-y-2">
        <h2 className="text-neutral-950 h6">Add content to your chapter</h2>
        <p className="text-neutral-800 body-base">
          Use the panel on the left to create new or update the existing chapters
        </p>
      </div>
    </div>
  );
};

export default CourseLessonEmptyState;
