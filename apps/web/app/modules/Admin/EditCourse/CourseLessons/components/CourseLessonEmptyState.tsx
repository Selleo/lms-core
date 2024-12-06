import CourseLessonEmptyStateImage from "~/assets/svgs/course-empty-state.svg";

const CourseLessonEmptyState = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white">
      <div className="w-1/3 flex items-center justify-center mt-4">
        <img
          src={CourseLessonEmptyStateImage}
          alt="courseLessonEmptyStateImage"
          className="rounded"
        />
      </div>
      <div className="text-center mb-3">
        <h2 className="text-2xl font-semibold text-gray-800">Add content to your chapter</h2>
        <p className="text-base text-gray-600 mt-2">
          Use the panel on the left to create new or update the existing chapters
        </p>
      </div>
    </div>
  );
};

export default CourseLessonEmptyState;
