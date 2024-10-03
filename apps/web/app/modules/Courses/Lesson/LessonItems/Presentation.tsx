import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { useParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useIntersection } from "react-use";
import { useMarkLessonItemAsCompleted } from "~/api/mutations/useMarkLessonItemAsCompleted";
import { useCompletedLessonItemsStore } from "./LessonItemStore";

type PresentationProps = {
  url: string;
  presentationId: string;
  isAdmin: boolean;
};

export default function Presentation({
  url,
  presentationId,
  isAdmin,
}: PresentationProps) {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const { lessonId } = useParams<{ lessonId: string }>();
  const {
    isLessonItemCompleted: isPresentationCompleted,
    markLessonItemAsCompleted: markPresentationAsCompleted,
  } = useCompletedLessonItemsStore();
  const { mutate: markLessonItemAsCompleted } = useMarkLessonItemAsCompleted();
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  useEffect(() => {
    if (!lessonId) throw new Error("Lesson ID not found");

    const isCompleted = isPresentationCompleted(presentationId);
    const isInViewport = intersection && intersection.intersectionRatio === 1;

    const loadTimeout = setTimeout(() => {
      if (isInViewport && !isCompleted && !isAdmin) {
        markPresentationAsCompleted({ lessonItemId: presentationId, lessonId });
        markLessonItemAsCompleted({ id: presentationId, lessonId });
      }
    }, 200);

    return () => clearTimeout(loadTimeout);
  }, [
    lessonId,
    presentationId,
    markLessonItemAsCompleted,
    intersection,
    isPresentationCompleted,
    markPresentationAsCompleted,
  ]);

  const docs = [
    {
      uri: url,
      fileType: "pptx",
      fileName: "Presentation",
    },
  ];

  return (
    <div
      className="w-full h-full flex justify-center items-center"
      ref={intersectionRef}
    >
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
