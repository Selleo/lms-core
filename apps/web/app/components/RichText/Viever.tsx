import { EditorContent, useEditor } from "@tiptap/react";
// eslint-disable-next-line import/no-named-as-default
import StarterKit from "@tiptap/starter-kit";

type ViewerProps = {
  content: string;
  style?: "default" | "prose";
};

const Viewer = ({ content, style }: ViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
  });

  if (!editor) return <></>;

  const className: string =
    style === "prose" ? "prose-mt-0 prose max-w-none dark:prose-invert" : "";

  return (
    <article className={className}>
      <EditorContent editor={editor} readOnly={true} />
    </article>
  );
};

export default Viewer;
