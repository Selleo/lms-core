import { useParams } from "@remix-run/react";
import ReactPlayer from "react-player/lazy";

import { useMarkLessonItemAsCompleted } from "~/api/mutations/useMarkLessonItemAsCompleted";

type VideoProps = {
  url: string | null;
  videoId: string;
  isAdmin: boolean;
  type: string;
  isCompleted: boolean;
  lessonItemId: string;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

export default function Video({
  url,
  videoId,
  isAdmin,
  type,
  isCompleted,
  lessonItemId,
  updateLessonItemCompletion,
}: VideoProps) {
  const { lessonId, courseId = "" } = useParams<{
    lessonId: string;
    courseId: string;
  }>();
  const { mutate: markLessonItemAsCompleted } = useMarkLessonItemAsCompleted();

  if (!url) throw new Error("Something went wrong");

  if (!lessonId) throw new Error("Lesson ID not found");

  const handleMarkLessonItemAsCompleted = () => {
    if (isCompleted) return;

    markLessonItemAsCompleted({ id: videoId, lessonId, courseId });
    updateLessonItemCompletion(lessonItemId);
  };

  const isExternalVideo = type === "external_video";

  return (
    <div className="w-full h-full flex justify-center items-center">
      {isExternalVideo ? (
        <ReactPlayer
          url={url}
          controls
          {...(!isAdmin && { onEnded: handleMarkLessonItemAsCompleted })}
        />
      ) : (
        <video
          width="100%"
          height="auto"
          controls
          className="rounded-lg"
          {...(!isAdmin && { onEnded: handleMarkLessonItemAsCompleted })}
        >
          <source src={url} />
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}
