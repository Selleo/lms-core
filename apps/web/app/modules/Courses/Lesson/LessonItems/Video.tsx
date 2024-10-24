import { useParams } from "@remix-run/react";
import { useMarkLessonItemAsCompleted } from "~/api/mutations/useMarkLessonItemAsCompleted";
import { useCompletedLessonItemsStore } from "./LessonItemStore";
import ReactPlayer from "react-player";

type VideoProps = {
  url: string;
  videoId: string;
  isAdmin: boolean;
  type: string;
};

export default function Video({ url, videoId, isAdmin, type }: VideoProps) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { mutate: markLessonItemAsCompleted } = useMarkLessonItemAsCompleted();
  const {
    isLessonItemCompleted: isVideoCompleted,
    markLessonItemAsCompleted: markVideoAsCompleted,
  } = useCompletedLessonItemsStore();

  if (!lessonId) throw new Error("Lesson ID not found");

  const handleMarkLessonItemAsCompleted = () => {
    if (isVideoCompleted(videoId)) return;
    markVideoAsCompleted({ lessonItemId: videoId, lessonId });
    markLessonItemAsCompleted({ id: videoId, lessonId });
  };

  const isExternalVideo = type === "external_video";

  return (
    <div className="w-full h-full flex justify-center items-center">
      {isExternalVideo ? (
        <ReactPlayer url={url} controls />
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
