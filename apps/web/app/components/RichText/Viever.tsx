import { EditorContent, useEditor } from "@tiptap/react";
// eslint-disable-next-line import/no-named-as-default
import StarterKit from "@tiptap/starter-kit";

import { cn } from "~/lib/utils";

type ViewerProps = {
  content: string;
  style?: "default" | "prose";
  className?: string;
};

const Viewer = ({ content, style, className }: ViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
  });

  if (!editor) return <></>;

  const classNames = cn(
    { "prose-mt-0 prose max-w-none dark:prose-invert": style === "prose" },
    className,
  );

  return (
    <article className={classNames}>
      <EditorContent
        editor={editor}
        readOnly={true}
        className="[&>div>ol]:list-disc [&>div>ol]:list-outside"
      />
    </article>
  );
};

export default Viewer;
