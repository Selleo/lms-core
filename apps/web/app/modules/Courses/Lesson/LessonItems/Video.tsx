import { useParams } from "@remix-run/react";
import { useMarkLessonItemAsCompleted } from "~/api/mutations/useMarkLessonItemAsCompleted";
import { useCompletedLessonItemsStore } from "./LessonItemStore";

type VideoProps = {
  url: string;
  videoId: string;
  isAdmin: boolean;
};

export default function Video({ url, videoId, isAdmin }: VideoProps) {
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

  const isDev = process.env.NODE_ENV === "development";

  //TODO: add some demo video for local dev or load it from the file
  const src = isDev
    ? "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    : url;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <video
        width="100%"
        height="auto"
        controls
        className="rounded-lg"
        {...(!isAdmin && { onEnded: handleMarkLessonItemAsCompleted })}
      >
        <source src={src} />
        <track kind="captions" />
      </video>
    </div>
  );
}
