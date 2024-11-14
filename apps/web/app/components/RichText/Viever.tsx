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

  const unOrderedListClasses = "[&>div>ul]:list-disc [&>div>ul]:list-inside [&>div>ul>li>p]:inline";
  const orderedListClasses =
    "[&>div>ol]:list-decimal [&>div>ol]:list-inside [&>div>ol>li>p]:inline";

  const editorClasses = cn(unOrderedListClasses, orderedListClasses);

  return (
    <article className={classNames}>
      <EditorContent editor={editor} readOnly={true} className={editorClasses} />
    </article>
  );
};

export default Viewer;
