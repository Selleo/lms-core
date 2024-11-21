import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { useParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useIntersection } from "react-use";

import { useMarkLessonItemAsCompleted } from "~/api/mutations/useMarkLessonItemAsCompleted";

type PresentationProps = {
  url: string;
  presentationId: string;
  isAdmin: boolean;
  isCompleted: boolean;
  lessonItemId: string;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

export default function Presentation({
  url,
  presentationId,
  isAdmin,
  isCompleted,
  lessonItemId,
  updateLessonItemCompletion,
}: PresentationProps) {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const { lessonId, courseId = "" } = useParams<{
    lessonId: string;
    courseId: string;
  }>();
  const { mutate: markLessonItemAsCompleted } = useMarkLessonItemAsCompleted();
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  useEffect(() => {
    if (!lessonId) throw new Error("Lesson ID not found");

    const isInViewport = intersection && intersection.intersectionRatio === 1;

    const loadTimeout = setTimeout(() => {
      if (isInViewport && !isCompleted && !isAdmin) {
        markLessonItemAsCompleted({ id: presentationId, lessonId, courseId });
        updateLessonItemCompletion(lessonItemId);
      }
    }, 200);

    return () => clearTimeout(loadTimeout);
  }, [
    isAdmin,
    lessonId,
    presentationId,
    markLessonItemAsCompleted,
    intersection,
    courseId,
    isCompleted,
    lessonItemId,
    updateLessonItemCompletion,
  ]);

  const docs = [
    {
      uri: url,
      fileType: "pptx",
      fileName: "Presentation",
    },
  ];

  return (
    <div className="w-full h-full flex justify-center items-center" ref={intersectionRef}>
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableFileName: false,
          },
        }}
      />
    </div>
  );
}
